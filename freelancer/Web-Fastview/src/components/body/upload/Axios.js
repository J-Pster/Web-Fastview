import axios from "axios";

export const axiosPost = (args, endpoint) => {
  var files = args.file;

  const formData = new FormData();

  formData.append("sistema_id", args.sistema_id);
  formData.append("empreendimento_id", args.empreendimento_id);
  formData.append("loja_id", args.loja_id);
  if(files){
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      formData.append(index, element);
    }
  }

  return axios.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const responseNormalizer = (
  response,
  error,
  file
) => ({
  file,
  error,
  response,
});
