import jwt from 'jsonwebtoken'

const generatedAccessToken = async(userId)=>{
    const token =  jwt.sign({ id : userId},
        process.env.JWT_TOKEN_ACCESS,
        { expiresIn : '7d'}
    )

    return token
}

export default generatedAccessToken