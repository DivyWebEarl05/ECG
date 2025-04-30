import Article from "../models/articlesModel.js";
const BASE_URL = "https://ecg-wv62.onrender.com/uploads/article/";
// const BASE_URL = "http://localhost:5000/uploads/article/"

const createArticle = async (req, res) => {
  try {
    const { blog_title, description, read_time } = req.body;
    const photo = req.file.path;
    const article = new Article({
      blog_title,
      description,
      read_time,
      photo,
    });

    await article.save();
    res.status(201).json({
      message: "Article craeted successfully",
      article,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error craeting artcle",
      error: error.message,
    });
  }
};

const getAllArticles = async (req, res) => {
  try {
    let articles = await Article.find({})
      .sort({ createdAt: -1 })
      .lean();

    articles = articles.map((article) => {
      if (article.photo) {
        const filename = article.photo.split("\\").pop().split("/").pop();
        article.photo = BASE_URL + filename;
      }
      return article;
    });

    res.status(200).json({
      success: true,
      message: "Articles fetched successfully",
      totalArticles: articles.length,
      articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching articles",
      error: error.message,
    });
  }
};


const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    // Convert to object and add base URL to photo
    const articleObj = article.toObject();
    if (articleObj.photo) {
      const filename = articleObj.photo.split("\\").pop().split("/").pop();
      articleObj.photo = BASE_URL + filename;
    }

    res.status(200).json({
      message: "Article fetched successfully",
      article: articleObj,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching article",
      error: error.message,
    });
  }
};
// const getAllArticles = async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1; // Default page = 1
//       const limit = parseInt(req.query.limit) || 10; // Default limit = 10
//       const skip = (page - 1) * limit;

//       const totalArticles = await Article.countDocuments();
//       const articles = await Article.find({})
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit);

//       res.status(200).json({
//         message: "Articles fetched successfully",
//         page,
//         totalPages: Math.ceil(totalArticles / limit),
//         totalArticles,
//         articles
//       });
//     } catch (error) {
//       res.status(500).json({
//         message: "Error fetching articles",
//         error: error.message,
//       });
//     }
// }

// const getArticleById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const article = await Article.findById(id);
//         if (!article){
//             return res.status(404).json({
//                 message: "Article not found"
//             })
//         }
//         res.status(200).json({
//             message : "Article fetched successsfully",
//             article
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: "Error fetching article",
//             error: error.message,
//         })
//     }
// }

const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { photo, blog_title, description, read_time } = req.body;

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        photo,
        blog_title,
        description,
        read_time,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({
      message: "Article updated successfully",
      updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle)
      return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

export {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
