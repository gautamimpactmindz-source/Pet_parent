import Activity from '../../models/activity/activity.model.js';
import Pet from '../../models/pet/pet.model.js';
import mongoose from 'mongoose';
//ADD ACTIVITY
export const addActivity=async(req,res)=>{
    try {
        const {slug}=req.params;
        const {description,activityDate,time}=req.body;


        const pet=await Pet.findOne({
           slug:slug,
            owner:req.user.id,
            isActive:true
        })
   let finalDate = new Date(activityDate);


if (time) {
  const [hours, minutes] = time.split(":").map(Number);

  finalDate = new Date(
    finalDate.getTime() +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000
  );
}

 
        if(!pet){
            return res.status(404).json({
                message:'Pet not found or not authorized!!',
                status:false
            })
        }

        const activity=new Activity({
            pet:{id:pet._id,slug:pet.slug},
            
            description,
            activityDate:finalDate
        })

        await activity.save();

        return res.status(201).json({
            message:'Activity added successfully!!',
            status:true,
            activity
        })
    } catch (error) {
        return res.status(500).json({
            message:'Failed to add Activity!!',
            error:error.message,
            status:false
        })
    }
}



export const getallactivity = async (req, res) => {
  try {
    const user = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const filter = req.query.selected;
    
   
    const limit =  2;
    
    const skip = (page - 1) * limit;
  const matchStage = {
    owner:new mongoose.Types.ObjectId(user)
  }
 if (filter && filter !== "All Species") {
  matchStage.species = filter;
}
    const pipeline = [

      {
        $match: matchStage
      },

      {
        $lookup: {
          from: "activities",
          localField: "_id",
          foreignField: "pet.id",
          as: "activities"
        }
      },
  {
    $match: {
      "activities.0": { $exists: true }
    }
  },
      { $unwind: "$activities" },

      {
        $lookup: {
          from: "petprofiles",
          localField: "_id",
          foreignField: "pet",
          as: "profile"
        }
      },

      {
        $project: {
          name: 1,
          slug: 1,
          species: 1,
          gender: 1,
          "breed.name": 1,

          activity: {
            _id: "$activities._id",
            description: "$activities.description",
            activityDate: "$activities.activityDate"
          },

          profileImage: {
            $arrayElemAt: ["$profile.profileImages.url", 0]
          }
        }
      },

      {
        $sort: {
          "activity.activityDate": -1
        }
      },

      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ];

    const result = await Pet.aggregate(pipeline);

    const data = result[0]?.data || [];
    const totalCount = result[0]?.totalCount?.[0]?.count || 0;

    return res.json({
      success: true,
      data,
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};
//GET ALL ACTIVITIES(FOR VIEWING HISTORY OF ACTIVITIES)
export const getActivitiesByPet=async(req,res)=>{
    try {
        const {petId}=req.params;

        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||10;
        const safeLimit=limit>10?10:limit;
        const skip=(page-1)*safeLimit;

        const{search,type,fromDate,toDate}=req.query;

        const pet=await Pet.findOne({
            _id:petId,
            owner:req.user.id,
            isActive:true
        })

        if(!pet){
            return res.status(404).json({
                message:'Pet not found or not Authorized!!',
                status:false
            })
        }

        const filter={
            pet:petId,
            isActive:true
        }

        if(type){
            filter.type=type;
        }

        if(search){
            filter.$or=[
               
                {description:{$regex:search,$options:'i'}}
            ]
        }

        if(fromDate||toDate){
            filter.activityDate={};
            if(fromDate) filter.activityDate.$gte=new Date(fromDate);
            if(toDate) filter.activityDate.$lte=new Date(toDate);
        }

        const activities=await Activity.find(filter)
                 .sort({activityDate:-1})
                 .skip(skip)
                 .limit(safeLimit)
                 .lean();
        

        const total=await Activity.countDocuments(filter);
        
        return res.status(200).json({
            status:true,
            message: activities.length === 0 
                   ? "No activities found for this pet"
                   : "Activities fetched successfully",
            data:activities,
            pagination:{
                totalRecords:total,
                currentPage:page,
                totalPages:Math.ceil(total/safeLimit),
                hasNextPage:page*safeLimit<total,
                hasPrevPage:page>1
            }
        })
    } catch (error) {
        return res.status(500).json({
            message:'Failed to fetch Activities!!',
            error:error.message,
            status:false
        })
    }
}

//GET SINGLE ACTIVITY
export const getActivityById=async(req,res)=>{
    try {
        const {id}=req.params;
        const activity=await Activity.findOne({
            _id:id,
            isActive:true
        }).populate({
            path:'pet',
            select:'owner'
        })
        
        if(!activity||!activity.pet ||String(activity.pet.owner) !== String(req.user.id)){
            return res.status(404).json({
                message:'Activity not found!!',
                status:false
            })
        }

        return res.status(200).json({
            status: true,
            activity
        });
    } catch (error) {
        return res.status(500).json({
            message:'Failed to fetch Activity!!',
            error:error.message,
            status:false
        })
    }
}

//EDIT ACTIVITY
export const updateActivity = async (req, res) => {
  try {

    const { pet,activityDate,time } = req.body;

    const findpet = await Pet.findOne({ slug: pet });

    if (!findpet) {
      return res.status(404).json({
        status: false,
        message: "Pet not found"
      });
    }
    let finalDate = new Date(activityDate);

if (time) {
  const [hours, minutes] = time.split(":").map(Number);

  finalDate = new Date(
    finalDate.getTime() +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000
  );
}



    const data = {
      ...req.body,
  activityDate: finalDate,
      pet: {
        id: findpet._id,
        slug: pet
      }
    };

    const activity = await Activity.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      data,
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({
        status: false,
        message: "Activity not found or not active"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Activity updated successfully",
      data: activity
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};


//SOFTDELETE ACTIVITY
export const deleteActivity=async(req,res)=>{

    try {
        const activity=await Activity.findOneAndDelete({
            _id:req.params.id,
            isActive:true
        })

       if(!activity){
        return res.status(404).json({
            message:'Activity not found or already deleted!!',
            status:false
        })
       }
      return res.status(200).json({
            message: "Activity deleted successfully",
            status: true
        });
    } catch (error) {
        return res.status(500).json({
            message:'Failed to delete Activity!!',
            status:false,
            error:error.message
        })
    }
}