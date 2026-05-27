import multer from "multer"

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
       callback(null,"./public")
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname)
    }
})

export const uploadFile = multer({storage})