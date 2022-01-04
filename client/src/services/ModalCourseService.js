import axios from "axios";
import authHeader from "./AuthHeader";
import url from "./url";

const server = axios.create({
    baseURL: url.url,
});

export default{
    fetchModalCourses(){
        return server.get("modalcourse", {
            headers: authHeader(),
        });
    },
    fetchModalCourse(semesterId){
        return server.get(`modalcourse/${semesterId}`);
    },
    createModalCourse(modalCourse){
        return server.post('modalcourse/create', modalCourse,{
            headers: authHeader(),
          });
    },
};