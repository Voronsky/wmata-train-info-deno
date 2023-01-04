import { Request, Response, NextFunction} from 'npm:express@4.18.2';
import { load } from 'https://deno.land/std/dotenv/mod.ts';
import * as jose from 'https://deno.land/x/jose@v4.11.2/index.ts';

const configData = await load();
const alg = 'HS256'
const TOKEN_SECRET : any = new TextEncoder().encode(configData['TOKEN_SECRET']);
console.log('TOKEN SECRET: '+TOKEN_SECRET);

/**
 * Placeholder singleton just to play around with JOSE lib. Must get deleted whenever I get around to it
 * Token handling must be done properly, DB et al.
 */
class Singleton {
    private static instance: Singleton;
    private jwt: any;

    set JWT(token: string){
        this.jwt = token;
        return;
    }

    get JWT(): string{
        return this.jwt;
    }

    private constructor(){}

    public static getInstance(): Singleton {
        if(!Singleton.instance){
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

}

/**
 * Generates a JWT to be used . Currently using a Singleton to store the JWT, need to refactor that whenever i get around
 * @param _req  - req body
 * @param res - response obj to respond with
 * @param _next  - not used
 */
export const generateToken = async (_req: Request, res: Response, _next: NextFunction) => {
    try{ 
        // Replace this placeholder logic and actually utilize request , like a good person.
        const s: Singleton = Singleton.getInstance();
        const token = await new jose.SignJWT({foo: 'bar'})
        .setProtectedHeader({alg}) // property alg has to be in there
        .sign(TOKEN_SECRET);
        s.JWT = token;
        console.log(`token generated ${token}`);
        res.status(200).send('Token generated!');
    } catch(err){
        res.status(500).send(' Encountered an error while attempting to generate a token.');
        console.log(err);
    }
}

/**
 * Authentication middleware, ensures that the user making calls has a valid JWT 
 * @param req 
 * @param res 
 * @param next 
 * @returns success response if it passes , or failure
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    // Token will be in one of these three
    //const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const s = Singleton.getInstance();
    const token: string= s.JWT;
    console.log(token);

    if(!token){
        return  res.status(403).send('You must generate a token for authentication');
    }

    try{
        const decoded = await jose.jwtVerify(token, TOKEN_SECRET,);
        req.user = decoded;
        return next();
    } catch (err){
        console.log(err);
        return res.status(401).send('Invalid token');
    }
}