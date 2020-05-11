import Base from "@/api/base";

const resource = "upload/";
export default {
  put(payload, headers) {
    return Base.put(resource, payload, { headers });
  },
};
