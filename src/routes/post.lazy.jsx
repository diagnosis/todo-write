import { createLazyFileRoute } from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";

export const Route = createLazyFileRoute('/post')({
  component: RouteComponent,
})

function RouteComponent() {
   // const {error, isLoading, data,} = useQuery()




  return <div>Hello "/post"!</div>
}
