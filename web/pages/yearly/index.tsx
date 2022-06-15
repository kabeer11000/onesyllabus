import {MongoDB} from "../../database";
import YearlyComponent from "@/components/YearlyContentList"

export const getServerSideProps = async () => {
    const db = await MongoDB;
    const groups = await db.collection("groups").find({excluded: {$ne: true}}, {_id:0}).toArray();
    // const categories = await (await fetch(PapersAPI.getCategories)).json();
    return {props: {groups: groups.map(group => ({...group, _id: String(group._id)}))}}
}
export const Yearly = ({groups}) => {
    // Show Cats
    // const router = useRouter();
    return (
        <YearlyComponent items={groups}/>
    )
}
export default Yearly;
