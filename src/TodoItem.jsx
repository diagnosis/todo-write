import {icons, Pencil, Trash2} from "lucide-react";
import ListView from "./Components/ListView.jsx";
import useListView from "./customhooks/useListView.js";
import CardView from "./Components/CardView.jsx";

export default function TodoItem({todo, index,isListView}) {


    console.log(isListView)
            if(isListView){
                return (
                    <ListView todo={todo} index={index}/>
                )
            }
            return (<CardView todo={todo} index={index}/>)


}