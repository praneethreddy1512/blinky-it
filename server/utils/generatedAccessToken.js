import jwt from 'jsonwebtoken'

const generatedAccessToken = async(userId)=>{
    const token = await jwt.sign({ id : userId},
        process.env.JWT_TOKEN_ACCESS,
        { expiresIn : '5h'}
    )

    return token
}

export default generatedAccessToken