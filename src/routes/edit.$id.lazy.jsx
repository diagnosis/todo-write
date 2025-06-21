import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TodoService } from '../webservices/TodoServices.js'
import { ArrowLeft, Calendar, FileText, Tag, Save, X, Loader } from 'lucide-react'

export const Route = createLazyFileRoute('/edit/$id')({
  component: EditTaskPage,
})

function EditTaskPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch the todo data
  const { data: todo, isLoading, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => TodoService.getTodo(id),
  })

  // Mutation for updating the task
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => TodoService.updateTodo(id, data),
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      queryClient.invalidateQueries({ queryKey: ['todo', id] })
      // Navigate back to home
      navigate({ to: '/' })
    },
    onError: (error) => {
      console.error('Error updating task:', error)
    }
  })

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      due_date: '',
      groupName: 'Work',
      completed: false
    },
    onSubmit: async ({ value }) => {
      // Format the data for the API
      const taskData = {
        title: value.title,
        description: value.description,
        due_date: new Date(value.due_date).toISOString(),
        groupName: value.groupName,
        completed: value.completed
      }
      
      updateTaskMutation.mutate({ id, data: taskData })
    },
  })

  // Update form values when todo data is loaded
  React.useEffect(() => {
    if (todo) {
      form.setFieldValue('title', todo.title)
      form.setFieldValue('description', todo.description || '')
      form.setFieldValue('due_date', todo.due_date.toISOString().slice(0, 16))
      form.setFieldValue('groupName', todo.groupName || 'Work')
      form.setFieldValue('completed', todo.completed)
    }
  }, [todo])

  const handleCancel = () => {
    navigate({ to: '/' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#d4f1f4' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#05445e' }}></div>
          <p className="text-lg font-medium" style={{ color: '#05445e' }}>Loading task...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#d4f1f4' }}>
        <div className="text-center p-8 rounded-lg shadow-lg bg-white">
          <p className="text-lg font-medium text-red-600">Error loading task: {error.message}</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 rounded-lg font-medium text-white"
            style={{ backgroundColor: '#189ab4' }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#d4f1f4' }}>
      {/* Header */}
      <div className="shadow-lg" style={{ backgroundColor: '#05445e' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg text-white hover:bg-opacity-20 hover:bg-white transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Task</h1>
              <p className="text-lg opacity-90" style={{ color: '#75e6da' }}>
                Update your task details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="p-8 space-y-6"
          >
            {/* Title Field */}
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Task title is required' : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold mb-2" style={{ color: '#05445e' }}>
                    <FileText className="w-4 h-4" />
                    <span>Task Title *</span>
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{ 
                      focusRingColor: '#75e6da',
                      '--tw-ring-color': '#75e6da'
                    }}
                  />
                  {field.state.meta.errors && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Description Field */}
            <form.Field name="description">
              {(field) => (
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold mb-2" style={{ color: '#05445e' }}>
                    <FileText className="w-4 h-4" />
                    <span>Description</span>
                  </label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Add task description (optional)..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 resize-none"
                    style={{ 
                      focusRingColor: '#75e6da',
                      '--tw-ring-color': '#75e6da'
                    }}
                  />
                </div>
              )}
            </form.Field>

            {/* Due Date Field */}
            <form.Field
              name="due_date"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Due date is required' : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold mb-2" style={{ color: '#05445e' }}>
                    <Calendar className="w-4 h-4" />
                    <span>Due Date *</span>
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="datetime-local"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{ 
                      focusRingColor: '#75e6da',
                      '--tw-ring-color': '#75e6da'
                    }}
                  />
                  {field.state.meta.errors && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Group Name Field */}
            <form.Field name="groupName">
              {(field) => (
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold mb-2" style={{ color: '#05445e' }}>
                    <Tag className="w-4 h-4" />
                    <span>Group</span>
                  </label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                    style={{ 
                      focusRingColor: '#75e6da',
                      '--tw-ring-color': '#75e6da'
                    }}
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
            </form.Field>

            {/* Completion Status */}
            <form.Field name="completed">
              {(field) => (
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 focus:ring-2"
                      style={{ 
                        accentColor: '#75e6da',
                        '--tw-ring-color': '#75e6da'
                      }}
                    />
                    <span className="text-sm font-semibold" style={{ color: '#05445e' }}>
                      Mark as completed
                    </span>
                  </label>
                </div>
              )}
            </form.Field>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={updateTaskMutation.isPending}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#189ab4' }}
              >
                {updateTaskMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Update Task</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={updateTaskMutation.isPending}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  borderColor: '#189ab4',
                  color: '#189ab4'
                }}
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>

            {/* Error Display */}
            {updateTaskMutation.isError && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 font-medium">
                  Error updating task: {updateTaskMutation.error?.message || 'Something went wrong'}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}