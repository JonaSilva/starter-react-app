
import axios from "axios";

const API_URL_IMAGESFLOORS = process.env.REACT_APP_DOMAIN + '/api/miniMap/ImagesFloors';
const API_URL_INSERT_IMAGES_DB = process.env.REACT_APP_DOMAIN + '/api/floors/newFloor';

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getImagesByModel = (model) => {
    
    return axios.post(API_URL_IMAGESFLOORS, JSON.stringify({ model }), config).then(res => { 
        return res.data;
      })
      .catch(err => {
        return err;
      });
    
};

const getImageFromURL = (urlToGet) => {
     return axios({
        method: 'GET',
        url: urlToGet,
        responseType: 'arraybuffer'
    }).then(res => {
        return res;
    })
    .catch(err => {
        return err;
    });
};

const insertImagesOnDB = (imagesToInsert) => {
    console.log("previo a enviar a back",imagesToInsert);
    return axios.post(API_URL_INSERT_IMAGES_DB, imagesToInsert).then(res => {
        console.log("res",res);
    }).catch(err => {
        return err
    })
};

const getImagesFromApi = async () => {
    const endpoint = "https://api.matterport.com/api/models/graph";
    const header = {
        "Content-Type":"application/json",
        "Authorization":"Basic NmFjYWYxNjFiZDFjNjIyMjoyNjI3NmM5MDgwN2UyNzU1NDdjNzA3MTlkNDkxNTU0NQ==",
    };
    const graphqlQuery = {
        "query":`query getSweeps($modelId: ID!){
            model(id: $modelId) {
                assets{
                    floorplans{
                        url
                        id
                        filename
                     provider
                     height
                     width
                     resolution
                        status
                       origin{
                           x
                           y
                       }
                       floor{
                            id
                            label
                        }
                    }
                }
            }
        }`,
        "variables":{
            "modelId": "tGdQs2pC6qd"
          }
    };

    const options = {
        method: 'POST',
        headers: header,
        body: JSON.stringify(graphqlQuery)
    };

    const test = await fetch(endpoint, options);
    const data = await test.json();
    return data;
};

const positionsServices = {
    getImagesByModel,
    getImageFromURL,
    getImagesFromApi,
    insertImagesOnDB
};

export default positionsServices;
