import { User, Heart, ShoppingBag, Menu,LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
    User,
    Heart,
    ShoppingBag,
    Menu,
}

export default function Icon({ name, size}: {name: string, size? : number}) {
    const IconName = icons[name];
    if (!IconName) {
        return null;
    }
    return <IconName size={size || 20} />

}