import axios from "axios";


const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

// Involvement API (likes & comments)
const INVOLVEMENT_BASE =
  "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pKSoTbGzFhj5RtoeFQif";

/* ------------------------ Met API ------------------------ */

// Get list of object IDs for paintings (used on Home)
export async function getPaintingIds() {
  const res = await axios.get(`${BASE_URL}/search`, {
    params: { q: "painting", hasImages: true },
  });
  return res.data.objectIDs || [];
}

// Get full artwork details by ID
export async function getArtworkById(id) {
  const res = await axios.get(`${BASE_URL}/objects/${id}`);
  return res.data;
}

// Get departments
export async function getDepartments() {
  const res = await axios.get(`${BASE_URL}/departments`);
  return res.data.departments || [];
}

// Search paintings by query
export async function searchPaintings(query) {
  const res = await axios.get(`${BASE_URL}/search`, {
    params: { q: query, hasImages: true },
  });
  return res.data.objectIDs || [];
}

// Search paintings by department
export async function searchPaintingsByDepartment(deptId) {
  const res = await axios.get(`${BASE_URL}/search`, {
    params: { departmentId: deptId, q: "painting", hasImages: true },
  });
  return res.data.objectIDs || [];
}

/* ------------------------ Likes & Comments (Involvement) ------------------------ */

export async function fetchAllLikes() {
  const res = await axios.get(`${INVOLVEMENT_BASE}/likes/`);
  return res.data;
}

export async function postLike(objectId) {
  return axios.post(`${INVOLVEMENT_BASE}/likes/`, { item_id: objectId });
}

export async function getComments(objectId) {
  const res = await axios.get(`${INVOLVEMENT_BASE}/comments`, {
    params: { item_id: objectId },
  });
  return res.data || [];
}

export async function postComment(objectId, username, comment) {
  return axios.post(`${INVOLVEMENT_BASE}/comments`, {
    item_id: objectId,
    username,
    comment,
  });
}
