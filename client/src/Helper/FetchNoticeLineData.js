import axios from "axios";

const FetchNoticeLineData = async () => {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVERURL}/api/v1/notice/all`);
        
        if (data.success) {
            // Map the response to match the expected format for notice line
            const formattedNotices = data.events.map(notice => ({
                Title: notice.title,
                Link: `/notices/${notice._id}`, // You can customize this link
                _id: notice._id,
                details: notice.details,
                createdAt: notice.createdAt
            }));
            
            return {
                success: true,
                data: formattedNotices
            };
        }
        return { success: false, data: [] };
    } catch (error) {
        console.error("Error fetching notices:", error);
        return { success: false, data: [] };
    }
};

export default FetchNoticeLineData;