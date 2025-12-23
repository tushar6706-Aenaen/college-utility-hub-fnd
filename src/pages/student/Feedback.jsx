import { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '@/lib/axios'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, MessageSquare, Send, AlertCircle, CheckCircle2 } from 'lucide-react'

const categories = ['Facilities', 'Services', 'Academic', 'Infrastructure', 'Other']

export default function StudentFeedback() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      subject: '',
      message: '',
      category: ''
    }
  })

  const message = watch('message', '')
  const maxChars = 1000

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await api.post('/feedback', { ...data, isAnonymous })
      toast.success('Feedback submitted successfully!')
      setSubmitted(true)
      reset()
      setIsAnonymous(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  const submitAnother = () => {
    setSubmitted(false)
    reset()
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
            </p>
            <Button onClick={submitAnother}>Submit Another Feedback</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Submit Feedback</h1>
        <p className="text-muted-foreground mt-1">
          Help us improve by sharing your thoughts and suggestions
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Feedback Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Feedback Form</CardTitle>
            <CardDescription>
              Your feedback helps us make the college experience better for everyone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Brief summary of your feedback"
                  {...register('subject', {
                    required: 'Subject is required',
                    maxLength: {
                      value: 200,
                      message: 'Subject cannot exceed 200 characters'
                    }
                  })}
                  className={errors.subject ? 'border-red-500' : ''}
                />
                {errors.subject && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  {...register('category', { required: 'Please select a category' })}
                />
                {errors.category && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="message">Message *</Label>
                  <span className={`text-sm ${message.length > maxChars ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {message.length}/{maxChars}
                  </span>
                </div>
                <Textarea
                  id="message"
                  placeholder="Describe your feedback in detail..."
                  rows={6}
                  {...register('message', {
                    required: 'Message is required',
                    maxLength: {
                      value: maxChars,
                      message: `Message cannot exceed ${maxChars} characters`
                    }
                  })}
                  className={errors.message ? 'border-red-500' : ''}
                />
                {errors.message && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <Label htmlFor="anonymous" className="text-sm font-normal cursor-pointer">
                  Submit anonymously (your identity will not be revealed)
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tips & Guidelines */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips for Good Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0" />
                  Be specific about the issue or suggestion
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0" />
                  Include relevant details like location or time
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0" />
                  Suggest possible solutions if applicable
                </li>
                <li className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0" />
                  Keep it constructive and respectful
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Anonymous Option</p>
                  <p className="text-sm text-blue-700 mt-1">
                    If you prefer to keep your identity private, check the anonymous option. 
                    Your feedback will still be reviewed with the same priority.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories Explained</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li><span className="font-medium">Facilities:</span> Classrooms, labs, library</li>
                <li><span className="font-medium">Services:</span> Canteen, transport, administration</li>
                <li><span className="font-medium">Academic:</span> Courses, exams, faculty</li>
                <li><span className="font-medium">Infrastructure:</span> Buildings, parking, Wi-Fi</li>
                <li><span className="font-medium">Other:</span> Anything else not listed above</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

