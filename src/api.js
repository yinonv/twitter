import axios from 'axios';

export function createPost(tweet){
    return axios.post(`https://itc-bootcamp-19-dot-charcha-dev.appspot.com/tweet`, {tweet});
}
export function getPosts(){
    return axios.get(`https://itc-bootcamp-19-dot-charcha-dev.appspot.com/tweet`);
}