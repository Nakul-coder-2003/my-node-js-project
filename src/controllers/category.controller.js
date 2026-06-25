export const createCategory = async(req,res)=>{
    try {
      const {name,description,parentCategory} = res.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required!" });
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "This category already exists!" });
        }
        const category = await categoryModel.create({
            name,
            description,
            parentCategory: parentCategory || null // Agar parent id aayi toh theek, warna null (matlab yeh main category hai)
        });
        res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}