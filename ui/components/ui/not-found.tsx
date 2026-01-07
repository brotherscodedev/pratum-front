import { ScrollArea } from "@/components/ui/scroll-area";

interface PropsNotFoundComponent{
    status : number
    mensage : string
}

export default function NotFoundComponent({status, mensage} : PropsNotFoundComponent) {
    return (
        <ScrollArea className="w-full h-full px-5 rounded-lg mb-1.5" >
            <div className="my-48" >
                <h2 className="text-center text-4xl text-emerald-900" > {status} </h2>
                <p className="text-center text-2xl" > {mensage} </p>
            </div>
        </ScrollArea>
    )
}