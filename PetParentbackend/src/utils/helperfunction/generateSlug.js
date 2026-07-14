import slugify from 'slugify';

const generateSlug=(value)=>{
    return slugify(value,{
        lower:true,
        strict:true,
        trim:true
    })
}

export default generateSlug;