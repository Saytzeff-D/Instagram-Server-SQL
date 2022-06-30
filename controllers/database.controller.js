const cloudinary = require('cloudinary')
const pool = require('../connection/connectionPool')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const register =(req, res)=>{
    let user = req.body
    console.log(req.body)
    let sql = `SELECT * FROM users WHERE email = '${req.body.email}'`
    pool.query(sql, (err, result)=>{
        if(err){
            throw err
        }else{
            if(result.length == 0){
                let insertQuery = `INSERT INTO users (fullName, userName, mobileNumber, email, pword, bio, image_url) VALUES ('${user.fullName}', '${user.userName}', '${user.mobileNumber}', '${user.email}', '${user.pword}', '${user.bio}', '${user.image_url}')`;
                pool.query(insertQuery, (err, result)=>{
                    if (err) {
                        throw err
                    } else {
                        res.json({msg: 'Success'})
                    }
                })
            }else{
                res.json({msg: 'E-mail Already exists'})
            }
        }
    })
}
const login =(req, res)=>{
    let loginInfo = req.body
    let sql = `SELECT * FROM users WHERE (email = '${loginInfo.info}' AND pword = '${loginInfo.pword}') OR (userName = '${loginInfo.info}'  AND pword = '${loginInfo.pword}') OR (mobileNumber = '${loginInfo.info}' AND pword = '${loginInfo.pword}')`
    pool.query(sql, (err, result)=>{
        if (err) {
            throw err
        } else {
            if (result.length == 0) {
                res.status(200).send({msg: 'Login Failed!'})
            } else {
                res.status(200).send({msg: 'Success', userId: result[0].userId})
            }                        
        }
    })
}
const userData =(req, res)=>{
    const userId = req.body
    pool.query(`SELECT * FROM users WHERE userId = ?`, req.body.userId, (err, result)=>{
        if(err){
            res.status(300).json({msg: 'Server Timeout'})
            throw err
        }else{
            res.status(200).json(result[0])
        }
    })
}
const profilePhoto =(req, res)=>{
    const image = req.body
    cloudinary.v2.uploader.upload(image.photo, {public_id: image.photoName}, (err, result)=>{
        if (err) {
            console.log(err)
            res.status(300).json({msg: 'Cloudinary Error'})
        } else {
            let photoUrl = result.secure_url
            pool.query(`UPDATE users SET image_url = '${photoUrl}' WHERE userId = '${req.body.userId}'`, (sqlErr, sqlRes)=>{
                if (sqlErr) {
                    res.status(400).json({msg: 'Internal Server error'})
                    throw sqlErr
                } else {
                    console.log(sqlRes)
                    res.json({imageUrl: photoUrl})
                }
            })
        }
    })
}
const editProfile = (req, res)=>{
    let sql = 'UPDATE users SET fullName = ?, userName = ?, mobileNumber = ?, email = ?, bio = ? WHERE userId =  ?'
    let varOptions = [req.body.fullName, req.body.userName, req.body.mobileNumber, req.body.email, req.body.bio, req.body.userId]
    pool.query(sql, varOptions, (err, result)=>{
        if(err){
            res.status(400).json("Edit Failed")
        }else{
            res.status(200).json("Success")
        }
    })   
}
const fetchProfile = (req, res)=>{
    const user_id = req.body.userId
    pool.query('SELECT * FROM users WHERE userName = ?', [req.body.userName], (err, result)=>{
        if(err) throw err
        const profile = result[0]
        pool.query('SELECT * FROM posts WHERE userId = ?', [user_id], (postErr, postResult)=>{
            if(postErr) throw postErr
            profile.postLength = postResult.length        
            pool.query('SELECT * FROM followers WHERE userId = ?', [user_id], (followersErr, followersResult)=>{
                if(followersErr) throw followersErr
                profile.followersLength = followersResult.length
                pool.query('SELECT * FROM following WHERE userId = ?', [user_id], (followingErr, followingResult)=>{
                    if(followingErr) throw followingErr
                    profile.followingLength = followingResult.length
                    res.status(200).json(profile)
                })
            })
        })
    })
}
const listOfAllUsers =(req, res)=>{
    pool.query('SELECT * FROM users', (err, result)=>{
        if (err) { throw err }
        console.log(result)
        res.status(200).json(result)
    })
}
const numOfFollower = (userId)=>{
}
const numOfFollowing = (userId)=>{
}
const createPost = (req, res)=>{
    const post = req.body
    cloudinary.v2.uploader.upload(post.mediaUrl, {resource_type: 'auto', timeout:120000}, (err, result)=>{
        if(err){
            console.log(err)
            res.status(400).json({...err, error: 'Cloudinary Error'})
        }else{
            console.log('Success')
            let sql = 'INSERT INTO posts (userId, mediaUrl, mediaType, caption) VALUES(?, ?, ?, ?)'
            let postVar = [post.userId, result.secure_url, post.mediaType, post.caption]
            pool.query(sql, postVar, (err, result)=>{
                if (err) {
                    res.status(400).json('Server Error')
                    throw err
                } else {
                    res.status(200).json({msg: 'Upload Successful'})
                }
            })
        }
    })
}
const fetchAllPost = (re, res)=>{
    pool.query('SELECT * FROM posts JOIN users USING(userId)', (err, result)=>{
        if (err) {
            res.status(400).json({msg: 'Server Error'})
        } else {
            res.status(200).json(result)
        }
    })
}

let DataBaseController = {register, login, userData, profilePhoto, editProfile, fetchProfile, createPost, fetchAllPost, listOfAllUsers}
module.exports = DataBaseController