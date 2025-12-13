import error404 from "@shared/assets/img/404-error.jpg";  
import {useTitle} from "@hooks/useTitle";

function PageNotFound() {
    
    useTitle("خطای 404");
      
    return (
        <>
            <br></br>
            <br></br>
            <img src={error404} style={{width:"600px"}} ></img>
        </>
    )
}

export default PageNotFound;