import axios from "axios";
import authHeader from "./AuthHeader";
import url from "./url";

const server = axios.create({
    baseURL: url.url,
});

export default{
    fetchModalCourses(){
        return server.get("modalcourse");
    },
    fettchModalCourse(semesterId){
        return server.get(`modalcourse/${semesterId}`, 
        {headers: authHeader()});
    },
    createModalCourse(modalCourse){
        return server.post('modalcourse/create', modalCourse, {
            header: authHeader(),
        });
    },
};