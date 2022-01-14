import { resolveQueryParam } from '../../util/resolveQueryParam';
import { useRouter } from 'next/router';

const ViewCategory = () => {
    const router = useRouter();
    const categoryId = resolveQueryParam(router.query, 'categoryId');
    return <div>{categoryId}</div>;
};

export default ViewCategory;
