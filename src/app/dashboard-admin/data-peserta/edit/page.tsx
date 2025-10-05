"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
import { Pencil } from "lucide-react"

interface EditPesertaProps {
    peserta: {
        id: string;
        no: number;
        username: string;
        password?: string;
        ujian: string;
        status: string;
    };
    onEdit: (id: string, data: { username: string; password: string; ujian: string }) => void;
}

type PesertaUpdatePayload = {
    username: string;
    password?: string;
    ujian: string;
};

export function EditPeserta({ peserta, onEdit }: EditPesertaProps) {
    // 1. State untuk mengontrol kedua dialog
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [position, setPosition] = React.useState("Pilih Tipe Ujian");

    React.useEffect(() => {
        if (isFormOpen) {
            setUsername(peserta.username);
            setPassword(peserta.password || ""); // Gunakan string kosong jika password undefined
            setPosition(peserta.ujian);
        }
    }, [isFormOpen, peserta]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // --- AREA VALIDASI INPUT ---
        if (!username.trim()) {
            alert("Username tidak boleh kosong.");
            return; // Validasi username
        }
        if (password.length < 6) {
            alert("Password minimal harus 6 karakter.");
            return; // Validasi panjang password
        }
        if (position === "Pilih Tipe Ujian") {
            alert("Silakan pilih tipe ujian terlebih dahulu.");
            return; // Validasi tipe ujian
        }

        const formData = { username, password, ujian: position };
        // console.log("Data yang akan dikirim:", formData);
        onEdit(peserta.id, formData);

        setIsFormOpen(false);
        setIsSuccessOpen(true);
    };

    return (
        <>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Pencil size={18} className="inline mr-2 cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="font-heading bg-white sm:max-w-[425px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader className="flex items-center justify-center">
                            <DialogTitle className="text-[#41366E] text-xl font-bold">Tambah Peserta</DialogTitle>
                            <DialogDescription className="text-base text-black font-medium">
                                Silahkan Isi Data Peserta
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label className="text-black" htmlFor="username-1">Username</Label>
                                <Input className="text-black" id="username-1" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="grid gap-3">
                                <Label className="text-black" htmlFor="password-1">Password</Label>
                                <Input className="text-black" id="password-1" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="grid gap-3 text-black">
                                <Label className="text-black" htmlFor="ujian-1">Ujian</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="w-full justify-start" variant="outline">{position}</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 text-black bg-white">
                                        <DropdownMenuLabel>Pilih Tipe</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                            <DropdownMenuRadioItem value="Ujian A">Ujian A</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Ujian B">Ujian B</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="Ujian C">Ujian C</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
                            <DialogClose asChild>
                                <Button className="w-full text-white bg-[#565656]" variant="outline">
                                    Kembali
                                </Button>
                            </DialogClose>
                            <Button className="w-full bg-[#7A5CB3] text-white" type="submit">
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog >

            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="font-heading bg-white sm:max-w-[425px]">
                    <DialogHeader className="flex items-center justify-center">
                        <DialogTitle className="text-black text-xl font-semibold text-center">
                            <Image
                                src="/images/berhasil.png"
                                alt="Logo Berhasil"
                                width={80}
                                height={80}
                                priority
                            />
                            <div className="mt-2">Berhasil</div>
                        </DialogTitle>
                        <DialogDescription className="text-base text-black font-medium">
                            Berhasil Edit Peserta
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="grid grid-cols-1 gap-4">
                        <DialogClose asChild>
                            <Button className="w-full text-white bg-[#749221]" variant="outline">
                                Tutup
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>

    )
}
