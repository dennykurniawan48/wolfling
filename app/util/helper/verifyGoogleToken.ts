import { GoogleLogin } from "../types/googlelogin/Googlelogin";

const verifyGoogleToken = async (token: string) => {
    let googleresponse: GoogleLogin = {
        success: false,
        data: null,
        err: null,
    }
    await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else if (res.status == 400) {
                throw new Error("Not Authorized");
            } else {
                console.log(res.status);
                throw new Error("Something went wrong.");
            }
        })
        .then((json) => {
            googleresponse.success = true
            googleresponse.data = json
            googleresponse.err = null
        })
        .catch((err) => {
            googleresponse.success = false;
            googleresponse.data = null;
            googleresponse.err = err.message;
        });


        return googleresponse;
};

export default verifyGoogleToken;