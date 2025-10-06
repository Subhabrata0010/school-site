import axios from "axios";

const FetchCarouselImages = async () => {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/carousel/all`);
        
        if (data.success) {
            // Map the response to match the expected format
            const formattedImages = data.images.map(img => ({
                ImageLink: img.imageURL,
                _id: img._id
            }));
            
            return {
                success: true,
                data: formattedImages
            };
        }
        return { success: false, data: [] };
    } catch (error) {
        console.error("Error fetching carousel images:", error);
        return { success: false, data: [] };
    }
};

export default FetchCarouselImages;