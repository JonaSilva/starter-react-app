
import axios from "axios";

const GRAPGHQL_FLOORPLANT = process.env.REACT_APP_DOMAIN + '/graphql/query/'
const GRAPGHQL_INPUT_QUERY = process.env.REACT_APP_DOMAIN + '/graphql/query/textQuery'

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}

const queryGraphql = async (query) => {
  const response = await axios.post(GRAPGHQL_FLOORPLANT, config);
  return response.data
}
const inputQueryGraphql = async (query, variables) => {
  let variableString = JSON.stringify(variables)
  console.log({ variableString })
  variableString = variableString.replace(/\\/g, "");
  console.log({ variableString })
  const response = await axios.post(GRAPGHQL_INPUT_QUERY, { query, variableString }, config);
  return response.data
}
const graphQlServices = {
  queryGraphql,
  inputQueryGraphql
}
export default graphQlServices
