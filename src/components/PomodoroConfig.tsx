import {
    Dialog,
    DialogContent,
    DialogFooter,
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
import { useContext, useState } from "react"
import { cn } from "@/lib/utils"
import { SettingsIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { PomodoroSettings } from "@/types"
import { calculateSessionDuration } from "@/lib/timer-utils"
import { DialogClose } from "@radix-ui/react-dialog"
import { ConfigContext, type ContextValueProps } from "@/context/configContext"

export default function PomodoroConfig() {
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
    const { tempSettings, setTempSettings, setSettings } = useContext(ConfigContext) as ContextValueProps
    return (
        <div className={cn("grid items-start gap-6", className)}>
            <SelectField
                label="Horas de estudio"
                name="studyHours"
                defaultValue={tempSettings.studyHours.toString()}
                itemLabel="hora"
                options={[1, 2, 3, 4, 5, 6]}
                setTempSettings={setTempSettings}
            />
            <SelectField
                label="Tiempo de descanso"
                name="breakMinutes"
                defaultValue={tempSettings.breakMinutes.toString()}
                itemLabel="minuto"
                options={[5, 10, 15, 20]}
                setTempSettings={setTempSettings}
            />
            <SelectField
                label="Intervalos de estudio"
                name="intervals"
                defaultValue={tempSettings.intervals.toString()}
                itemLabel="intervalo"
                options={[2, 3, 4, 5, 6]}
                setTempSettings={setTempSettings}
            />
            <div className="flex items-center gap-2 justify-between">
                <Label htmlFor="soundEnabled">Sonido de notificacion</Label>
                <Switch
                    onCheckedChange={() => setTempSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                    defaultChecked={tempSettings.soundEnabled}
                    id="soundEnabled"
                />
            </div>

            <div className="flex items-center gap-2 justify-between">
                <Label htmlFor="autoStart">Inicio automatico</Label>
                <Switch
                    onCheckedChange={() => setTempSettings((prev) => ({ ...prev, autoStart: !prev.autoStart }))}
                    defaultChecked={tempSettings.autoStart}
                    id="autoStart"
                />
            </div>

            <div className="text-sm text-white/85 bg-black/50 p-3 rounded-lg">
                <p>Cada sesión durará: <strong>{Math.floor(calculateSessionDuration(tempSettings.studyHours, tempSettings.intervals, tempSettings.breakMinutes) / 60)} minutos</strong></p>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <button onClick={() => setSettings(tempSettings)}>Guardar</button>
                </DialogClose>
            </DialogFooter>
        </div>
    )
}


interface SelectFieldProps {
    label: string
    name: string
    itemLabel: string
    selectLabel?: string
    defaultValue: string
    options: number[]
    setTempSettings: React.Dispatch<React.SetStateAction<PomodoroSettings>>
}
function SelectField({ label, name, itemLabel, selectLabel, defaultValue, options, setTempSettings }: SelectFieldProps) {
    return (
        <div className="grid gap-3">
            <Label htmlFor={name}>{label}</Label>
            <Select
                name={name}
                defaultValue={defaultValue}
                onValueChange={(e) => setTempSettings((prev) => ({ ...prev, [name]: parseInt(e) }))}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una opcion" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {selectLabel && <SelectLabel>{selectLabel}</SelectLabel>}
                        {
                            options.map((value) => (
                                <SelectItem key={value} value={value.toString()}>
                                    {value} {itemLabel}{value === 1 ? '' : 's'}
                                </SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}