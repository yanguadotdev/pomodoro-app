import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { SettingsIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"


export default function PomodoroSettings() {
    const [open, setOpen] = useState(false)
    const isDesktop = true

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button className="text-white group">
                        <SettingsIcon className="size-7 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Configuración</DialogTitle>
                    </DialogHeader>
                    <EditStudyHours />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button className="text-white group">
                    <SettingsIcon className="size-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Configuración</DrawerTitle>
                </DrawerHeader>
                <EditStudyHours className="px-4" />
            </DrawerContent>
        </Drawer>
    )
}

function EditStudyHours({ className }: React.ComponentProps<"div">) {
    return (
        <div className={cn("grid items-start gap-6", className)}>
            <SelectField label="Horas de estudio" options={[1, 2, 3, 4, 5, 6]} />
            <SelectField label="Tiempo de descanso" options={[5, 10, 15, 20]} />
            <SelectField label="Intervalos de estudio" options={[2, 3, 4, 5, 6]} />
            <div className="flex items-center gap-2 justify-between">
                <Label htmlFor="soundEnabled">Sonido de notificacion</Label>
                <Switch defaultChecked id="soundEnabled" />
            </div>

            <div className="flex items-center gap-2 justify-between">
                <Label htmlFor="autoStart">Inicio automatico</Label>
                <Switch id="autoStart" />
            </div>

            <button>Guardar</button>
        </div>
    )
}


interface SelectFieldProps {
    label: string
    selectLabel?: string
    options: number[]
}
function SelectField({ label, selectLabel, options }: SelectFieldProps) {
    return (
        <div className="grid gap-3">
            <Label htmlFor="breakHours">{label}</Label>
            <Select name="breakHours">
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una opcion" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {selectLabel && <SelectLabel>{selectLabel}</SelectLabel>}
                        {
                            options.map((minutes) => (
                                <SelectItem key={minutes} value={minutes.toString()}>
                                    {minutes} minutos
                                </SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}