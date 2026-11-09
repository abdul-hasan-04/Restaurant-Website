import supabase from "../lib/supabase";

export const uploadProductImg = async (file, user_id, bucket = "menu_image") => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePAth = `${user_id}/${fileName}`;
    // start uploading image //
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePAth, file, {
            contentType: file.type,
            cacheControl: "3600",
            upsert: true
        })

    if (error) {
        throw error
    }

    //  getPublicUrl
    const {data:publicDataUrl,error:publicUrlError} = supabase.storage
    .from(bucket)
    .getPublicUrl(filePAth);

    if(publicUrlError){
        throw publicUrlError
    }

    return {url : publicDataUrl.publicUrl}
}


export const uploadProfileAvatar = async (file,user_id,bucket = "profile_image") => {
    if(!file) return;
    const fileExtension = file?.name.split(".").pop().toLowerCase();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePAth = `${user_id}/${fileName}`;

    const {data : uploadedFile,error : uploadeError} = supabase.storage
    .from(bucket)
    .upload(filePAth,file, {
        contentType : file.type,
        cacheControl : "3600",
        upsert : true
    })

    if(uploadeError) {
       throw uploadeError
    }

    const {data : getPublicUrl, error : publicDataUrlError} = supabase.storage
    .from(bucket)
    .getPublicUrl(filePAth)

    if(publicDataUrlError){
        throw publicDataUrlError
    }

    return {url : getPublicUrl.publicUrl}
}

