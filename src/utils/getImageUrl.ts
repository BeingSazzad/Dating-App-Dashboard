import { imageUrl } from '../redux/api/baseApi';

export function getImageUrl(imageurl: string | null | undefined) {
    if (!imageurl) return "";
    if (imageurl?.startsWith('http') || imageurl?.startsWith('blob:')) return imageurl;
    return imageUrl + imageurl;
}
