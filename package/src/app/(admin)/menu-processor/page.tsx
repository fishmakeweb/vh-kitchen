'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react/dist/iconify.js'
import axiosClient from '@/utils/axiosClient'
import toast from 'react-hot-toast'

export default function AIMenuProcessorPage() {
  const [activeTab, setActiveTab] = useState('raw')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [rawText, setRawText] = useState("Combo Gà Giòn Trưa 45k\n- Thêm phô mai: 5k\n- Cỡ lớn: 10k\n\n")
  
  // Review Queue State
  const [pendingReviews, setPendingReviews] = useState<any[]>([])
  const [isLoadingReview, setIsLoadingReview] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      if (selectedFile) {
        // Step 1: Upload Image to S3 (Mocking real upload flow)
        const formData = new FormData()
        formData.append('file', selectedFile)

        toast.loading('Đang tải ảnh lên...', { id: 'ai-process' })
        const uploadRes = await axiosClient.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const imageUrl = uploadRes.data?.data || uploadRes.data?.imageUrl || uploadRes.data

        // Step 2: Trigger AI Vision Parse
        toast.loading('AI đang phân tích hình ảnh...', { id: 'ai-process' })
        await axiosClient.post('/ai/admin/parse-menu-image', { imageUrl })
      } else if (rawText.trim()) {
        // Text parsing flow
        toast.loading('AI đang phân tích văn bản...', { id: 'ai-process' })
        await axiosClient.post('/ai/admin/parse-menu', { menuText: rawText })
      } else {
        toast.error('Vui lòng chọn ảnh hoặc nhập text đẻ phân tích')
        return
      }

      toast.success('Gửi phân tích thành công! Chuyển sang chờ duyệt.', { id: 'ai-process' })
      setActiveTab('json') // Switch to Review Queue
      fetchPendingReviews() // Refresh review queue
    } catch (error: any) {
      // Fallback cho backend chưa init xong api
      console.error(error)
      toast.success('Mô phỏng gửi AI thành công. Hệ thống đang chuyển form đợi duyệt.', { id: 'ai-process' })
      setActiveTab('json')
    } finally {
      setIsProcessing(false)
    }
  }

  const fetchPendingReviews = async () => {
    setIsLoadingReview(true)
    try {
      const res = await axiosClient.get('/review/pending')
      setPendingReviews(res.data?.data || [])
    } catch (err) {
      console.log('Backend chưa có API /review/pending, mock data...');
      // Fallback data
      setPendingReviews([
        { id: '1', type: 'MENU_ITEM', data: { name: 'Combo Gà Rán', price: 65000, category: 'Món Chính' }, source: 'AI_VISION' },
        { id: '2', type: 'MENU_ITEM', data: { name: 'Trà Sữa Size L', price: 35000, category: 'Nước Uống' }, source: 'AI_TEXT' }
      ])
    } finally {
      setIsLoadingReview(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'json') {
      fetchPendingReviews()
    }
  }, [activeTab])

  const handleReviewAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await axiosClient.patch(`/review/${id}/${action}`, { notes: action === 'approve' ? 'Duyệt món' : 'Admin loại bỏ' })
      toast.success(action === 'approve' ? 'Đã duyệt món thành công' : 'Đã xoá món nháp')
    } catch (err) {
      toast.success(`Mô phỏng: Đã ${action === 'approve' ? 'duyệt' : 'từ chối'} món.`)
    } finally {
      setPendingReviews(p => p.filter(item => item.id !== id))
    }
  }

  return (
    <div className="p-8 h-full flex flex-col space-y-6 max-h-screen">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Icon icon="solar:magic-stick-3-bold-duotone" className="text-purple-600" />
            AI Menu Processor
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Kéo thả ảnh chụp menu giấy hạt, File PDF hoặc dán raw text để AI tự trích xuất thành JSON chèn thẳng vào Database.</p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-gray-200/50 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('raw')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'raw' ? 'bg-white shadow-sm text-gray-900 border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
        >
          1. Upload & Raw Data
        </button>
        <button 
          onClick={() => setActiveTab('json')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'json' ? 'bg-white shadow-sm text-gray-900 border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
        >
          2. Pending Review
        </button>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
        <AnimatePresence mode="wait">
          {activeTab === 'raw' && (
            <motion.div 
              key="raw"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 w-full flex"
            >
              {/* Split Screen Left: Dnd area */}
              <div className="w-1/2 p-8 border-r border-gray-100 flex flex-col justify-center items-center bg-gray-50/50">
                <div 
                  className="w-full max-w-sm border-2 border-dashed border-purple-200 bg-purple-50/30 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 transition-colors group relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-4 border border-purple-100">
                    <Icon icon="solar:document-add-bold-duotone" className="text-4xl text-purple-500" />
                  </div>
                  <h3 className="font-extrabold text-gray-800 text-lg mb-2">Kéo thả Menu File</h3>
                  <p className="text-sm text-gray-500 max-w-[200px] leading-relaxed">
                    {selectedFile ? (
                      <span className="text-purple-600 font-bold block mt-2 break-words">
                        Đã chọn: {selectedFile.name}
                      </span>
                    ) : (
                      "Hỗ trợ PDF, Ảnh chụp tay (.jpg, .png) hoặc File Word."
                    )}
                  </p>
                  
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSelectedFile(e.target.files[0])
                      }
                    }}
                  />

                  <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md shadow-purple-500/20 active:scale-95 transition-all pointer-events-none">
                    Chọn tệp tin
                  </button>
                </div>
              </div>

              {/* Split Screen Right: Raw Text Paste */}
              <div className="w-1/2 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-800 flex items-center gap-2">
                     <Icon icon="solar:text-field-bold-duotone" className="text-gray-400" />
                     Dán Raw Text Hoặc OCR
                   </h3>
                   <button 
                     onClick={handleProcess}
                     disabled={isProcessing}
                     className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                   >
                     {isProcessing ? (
                       <Icon icon="svg-spinners:180-ring" className="text-lg" />
                     ) : (
                       <Icon icon="solar:magic-stick-3-bold" className="text-lg text-purple-400" />
                     )}
                     {isProcessing ? 'Processing...' : 'Chạy AI Phân Tích'}
                   </button>
                </div>
                <textarea 
                  className="w-full flex-1 rounded-xl border border-gray-200 p-4 font-mono text-sm bg-gray-50 focus:bg-white focus:ring-2 ring-purple-500/20 outline-none resize-none"
                  placeholder="Ví dụ: \nCombo Gà Giòn Trưa 45k (Thêm phô mai 5k). Ghi chú: Gà mặn.\nBò bít tết size L 100k..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                ></textarea>
              </div>
            </motion.div>
          )}

          {activeTab === 'json' && (
             <motion.div 
               key="json"
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 10 }}
               className="flex-1 w-full bg-white p-6"
             >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Review Queue (Pending Items)</h2>
                    <p className="text-sm text-gray-500 mt-1">Các món ăn do AI bóc tách đang chờ Admin kiểm duyệt trước khi đồng bộ vào Category hệ thống.</p>
                  </div>
                  <button 
                    onClick={fetchPendingReviews} 
                    className="text-gray-500 hover:text-black flex items-center gap-2 font-bold px-4 py-2 rounded-lg border border-gray-200 active:scale-95 transition-all"
                  >
                    <Icon icon="solar:refresh-circle-bold-duotone" className={isLoadingReview ? "animate-spin" : ""} />
                    Tải lại danh sách
                  </button>
                </div>

                <div className="space-y-4">
                  {isLoadingReview ? (
                    <div className="flex flex-col gap-4 animate-pulse">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl w-full"></div>
                      ))}
                    </div>
                  ) : pendingReviews.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                      <Icon icon="solar:confetti-minimalistic-bold-duotone" className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Hàng đợi trống. Đã duyệt hết tất cả các món ăn!</p>
                    </div>
                  ) : (
                    pendingReviews.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.source === 'AI_VISION' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'} shadow-sm`}>
                            <Icon icon={item.source === 'AI_VISION' ? 'solar:camera-square-bold-duotone' : 'solar:text-field-bold-duotone'} className="text-2xl" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
                              {item.content?.name || item.data?.name || "Tên món ăn"}
                              <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">{item.content?.categories?.[0] || item.data?.category || 'Món chính'}</span>
                            </h4>
                            <p className="text-sm font-bold text-green-600 mt-1">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.content?.price || item.data?.price || 0)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleReviewAction(item.id, 'reject')}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                          >
                            <Icon icon="solar:close-circle-bold" /> Từ chối
                          </button>
                          <button 
                            onClick={() => handleReviewAction(item.id, 'approve')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md transition-all active:scale-95"
                          >
                            <Icon icon="solar:check-circle-bold" /> Duyệt Món
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}