"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Trash } from "lucide-react"

interface HapusHasilUjianProps {
    pesertaId: number;
    ujianId: number;
    onHapus: (pesertaId: number, ujianId: number) => Promise<boolean>;
}

export function HapusHasilUjian({ pesertaId, ujianId, onHapus }: HapusHasilUjianProps) {
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // 2. Kirim kedua ID saat memanggil onHapus
        const success = await onHapus(pesertaId, ujianId);

        if (success) {
            setIsConfirmOpen(false);
        }
    };

    return (
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <DialogTrigger asChild>
                <Trash size={18} className="inline mr-2 cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="font-heading bg-white sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="flex items-center justify-center">
                        <DialogTitle className="flex flex-col items-center text-black text-xl font-semibold">
                            <Image src="/images/hapus.png" alt="Logo Hapus" width={80} height={80} />
                            <div className="mt-2 text-center">Peringatan!</div>
                        </DialogTitle>
                        <DialogDescription className="text-base text-black font-medium">
                            Apakah anda yakin ingin hapus hasil ujian peserta ini?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
                        <DialogClose asChild>
                            <Button type="button" className="w-full text-white bg-[#565656]" variant="outline">
                                Tidak
                            </Button>
                        </DialogClose>
                        <Button className="w-full bg-[#CD1F1F] text-white" type="submit">
                            Hapus
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
