import UploadButton from "./upload-button"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import Link from "next/link"
import { FileIcon, ImageIcon, MoreVertical, Download, Trash2, Info } from "lucide-react" // İkonlar
import { deleteFile } from "./actions" // <--- BUNU EKLE
import DeleteButton from "./delete-button"

export default async function FilesPage({
  searchParams,
}: {
  searchParams: { fileId?: string }
}) {
  const supabase = createClient()

  // 1. Kullanıcıyı ve Şirketini Bul
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user?.id)
    .single()

  // 2. Dosyaları Çek
  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('company_id', profile?.company_id)
    .order('created_at', { ascending: false })

  // 3. Seçili Dosyayı Bul (URL'deki fileId varsa)
  const selectedFile = searchParams.fileId 
    ? files?.find(f => f.id === searchParams.fileId) 
    : null

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      
      {/* SOL PANEL: DOSYA LİSTESİ (%70 Genişlik) */}
      <div className={`flex-1 overflow-y-auto ${selectedFile ? 'hidden md:block' : 'block'}`}>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Dosyalarım</h1>
          <UploadButton />
        </div>

        {/* Dosya Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files?.map((file) => (
            <Link 
              key={file.id} 
              href={`/dashboard/files?fileId=${file.id}`}
              className={`group relative flex flex-col items-center justify-between p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md
                ${selectedFile?.id === file.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'bg-white border-gray-200'}
              `}
            >
              {/* İkon */}
              <div className="h-24 w-full flex items-center justify-center bg-gray-50 rounded-lg mb-3 group-hover:bg-white transition-colors">
                {file.file_type.includes('image') ? (
                   <ImageIcon className="w-10 h-10 text-purple-500" />
                ) : (
                   <FileIcon className="w-10 h-10 text-blue-500" />
                )}
              </div>
              
              {/* İsim */}
              <div className="w-full text-center">
                <p className="font-medium text-sm truncate text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(file.created_at), { addSuffix: true, locale: tr })}
                </p>
              </div>
            </Link>
          ))}

          {/* Dosya Yoksa */}
          {(!files || files.length === 0) && (
            <div className="col-span-full text-center py-12 text-gray-400">
              Henüz hiç dosya yüklenmemiş.
            </div>
          )}
        </div>
      </div>

      {/* SAĞ PANEL: DETAYLAR (%30 Genişlik) */}
      {selectedFile && (
        <div className="w-full md:w-[350px] lg:w-[400px] border-l bg-white pl-6 overflow-y-auto h-full animate-in slide-in-from-right-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Dosya Detayı
            </h2>
            <Link href="/dashboard/files">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">X</Button>
            </Link>
          </div>

          <div className="flex flex-col items-center mb-8 p-6 bg-gray-50 rounded-xl border border-dashed">
             {selectedFile.file_type.includes('image') ? (
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-2xl">IMG</div>
             ) : (
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">DOC</div>
             )}
             <h3 className="mt-4 font-bold text-gray-800 text-center break-all">{selectedFile.name}</h3>
             <p className="text-sm text-gray-500">{selectedFile.file_type}</p>
          </div>

          <div className="space-y-6">
            <div>
                <label className="text-xs font-semibold text-gray-400 uppercase">Yükleyen</label>
                <div className="flex items-center gap-3 mt-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">U</div>
                    <span className="text-sm font-medium">Sistem Yöneticisi</span>
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold text-gray-400 uppercase">Yükleme Tarihi</label>
                <p className="text-sm mt-1 font-medium">
                    {new Date(selectedFile.created_at).toLocaleDateString('tr-TR', { dateStyle: 'long' })}
                </p>
                <p className="text-xs text-gray-400">
                    {new Date(selectedFile.created_at).toLocaleTimeString('tr-TR')}
                </p>
            </div>

            {selectedFile.note && (
                <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase">Not</label>
                    <p className="text-sm mt-1 bg-yellow-50 p-3 rounded-md text-yellow-800 border border-yellow-100">
                        {selectedFile.note}
                    </p>
                </div>
            )}

            <div className="pt-4 flex flex-col gap-3">
                
                {/* 1. İNDİRME BUTONU */}
                {/* Supabase'den Public URL oluşturuyoruz */}
                <a 
                    href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/limo-files/${selectedFile.storage_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                >
                    <Button className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4" /> İndir / Önizle
                    </Button>
                </a>

                {/* 2. SİLME BUTONU (Form içinde Server Action) */}
                {/* Eski form kodunu sil, yerine bunu yapıştır */}
<DeleteButton fileId={selectedFile.id} storagePath={selectedFile.storage_path} />
            </div>
          </div>

        </div>
      )}
      
      {/* Sağ panel boşken (Seçili dosya yoksa) */}
      {!selectedFile && (
         <div className="hidden md:flex w-[350px] lg:w-[400px] border-l items-center justify-center text-gray-300 bg-gray-50/50">
            <div className="text-center">
                <Info className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Detayları görmek için bir dosyaya tıkla.</p>
            </div>
         </div>
      )}

    </div>
  )
}