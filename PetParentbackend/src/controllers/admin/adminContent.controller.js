import cloudinary from "../../config/cloudinary.js";

import streamifier from "streamifier";
import { Content } from "../../models/content/content.model.js";

export const createContent = async (req, res) => {
  


  const { title, body, metaTitle, excerpt,metaDescription, status } = req.body;

  try {
    if (!title || !body || !metaTitle || !metaDescription || !excerpt) {
      return res.status(400).json({
        message: "All fields are required",
        status: false,
      });
    }
    console.log(req.file);

    let imageData = {};

    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "content" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      imageData = {
        url: result.secure_url,
        key: result.public_id,
      };
    }

    const createContent = await Content.create({
      title,
      body,
      metaTitle,
      metaDescription,
      excerpt,
      status,
      ContentImage: imageData,
    });

    return res.status(201).json({
      message: "Content created successfully",
      status: true,
      data: createContent,
    });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      message: "Unable to create content",
      status: false,
    });
  }
};

export const Getallcontent = async (req, res) => {
  let { page = 1, limit = 10, search = "" } = req.query;

  try {
    page = parseInt(page);
    limit = parseInt(limit);

    const safeLimit = limit > 5 ? 10 : limit;
    const skip = (page - 1) * safeLimit;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } }


      ];
    }

    const Contents = await Content.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit);


    const total = await Content.countDocuments(filter);

    return res.status(200).json({
      message: "Content retrieved successfully.",
      status: true,
      data: Contents || [],
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (err) {
    console.log("err :", err);
    return res.status(500).json({
      message: "Unable to fetch content.",
      status: false,
    });
  }
};


export const allcontent = async (req, res) => {
  let { page = 1, limit = 10, search = "" } = req.query;

  try {
    page = parseInt(page);
    limit = parseInt(limit);

    const safeLimit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * safeLimit;

    const filter = { isActive: true,status: "published"  };

    if (search) {
      filter.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    const Contents = await Content.find(filter,{isActive:0,metaTitle:0,metaDescription:0,status:0,body:0,createdAt:0,updatedAt:0})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit);

    if (!Contents || Contents.length === 0) {
      return res.status(404).json({
        message: "No content found.",
        status: false,
      });
    }

    const total = await Content.countDocuments(filter);

    return res.status(200).json({
      message: "Content retrieved successfully.",
      status: true,
      data: Contents,
      
    });
  } catch (err) {
    console.log("err :", err);
    return res.status(500).json({
      message: "Unable to fetch content.",
      status: false,
    });
  }
};

export const singleGet = async (req, res) => {
  const slug = req.params.slug;

  try {
    const Contents = await Content.findOne({ slug, isActive: true });
    if (!Contents) {
      return res.status(404).json({
        message: "Content not found.",
        status: false,
      });
    }
    
    return res.status(200).json({
      message: "Content retrieved successfully.",
      data: Contents,
      status: true,
    });
  } catch (err) {
    console.log("err :", err);
    return res.status(500).json({
      message: "Unable to fetch content.",
      status: false,
    });
  }
};



export const detailedcontent = async (req, res) => {
  const slug = req.params.slug;

  try {
    const Contents = await Content.findOne({ slug, isActive: true, status: "published" });
    if (!Contents) {
      return res.status(404).json({
        message: "Content not found.",
        status: false,
      });
    }
    
    return res.status(200).json({
      message: "Content retrieved successfully.",
      data: Contents,
      status: true,
    });
  } catch (err) {
    console.log("err :", err);
    return res.status(500).json({
      message: "Unable to fetch content.",
      status: false,
    });
  }
};

export const softdelete = async (req, res) => {
  const slug = req.params.slug;

  try {
    const existingContent = await Content.findOneAndUpdate(
      { slug, isActive: true },
      { isActive: false },
      { new: true },
    );

    if (!existingContent) {
      return res.status(404).json({
        message: "Content not found or already inactive.",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Content deactivated successfully.",
      status: true,
    });
  } catch (err) {
    console.log("err :", err);
    return res.status(500).json({
      message: "Unable to deactivate content.",
      status: false,
    });
  }
};

export const contentdelete = async (req, res) => {
  const slug = req.params.slug;

  try {
    const existingContent = await Content.findOneAndDelete({ slug });

    if (!existingContent) {
      return res.status(404).json({
        message: "Content not found.",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Content deleted permanently.",
      status: true,
    });
  } catch (err) {
    console.log("err :", err);
    return res.status(500).json({
      message: "Unable to delete content.",
      status: false,
    });
  }
};

export const contentUpdate = async (req, res) => {
  const slug = req.params.slug;

  try {
    const existingContent = await Content.findOne({ slug });
    if (!existingContent) {
      return res.status(404).json({
        message: "Content not found.",
        status: false,
      });
    }

    if (req.file) {
      if (existingContent.ContentImage?.key) {
        await cloudinary.uploader.destroy(existingContent.ContentImage.key);
      }

      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "content" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            },
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();

      if (existingContent.ContentImage?.url === result.secure_url) {
        return res.status(400).json({
          message: "Same image already uploaded",
          status: false,
        });
      }

     existingContent.ContentImage = {
        url: result.secure_url,
        key: result.public_id,
      };
    }

    existingContent.title = req.body.title || existingContent.title;
    existingContent.body = req.body.body || existingContent.body;
    existingContent.excerpt = req.body.excerpt || existingContent.excerpt;
    existingContent.metaTitle = req.body.metaTitle || existingContent.metaTitle;
    existingContent.metaDescription =
      req.body.metaDescription || existingContent.metaDescription;
    existingContent.status = req.body.status || existingContent.status;
    existingContent.isActive = existingContent.isActive;

    const savecontent = await existingContent.save();

    return res.status(200).json({
      message: "Content updated successfully.",
      status: true,
      data: { title: savecontent.title },
    });
  } catch (err) {
    console.log("err :", err);
    return res.status(500).json({
      message: "Unable to update content.",
      status: false,
    });
  }
};
