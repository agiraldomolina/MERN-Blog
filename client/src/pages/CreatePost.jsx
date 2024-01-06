import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export default function CreatePost() {
  return (
    <div
        className='p-3 max-w-3xl mx-auto min-h-screen'
    >
        <h1
            className='text-center font-semibold text-3xl my-7'
        >
            Create a Post
        </h1>
        <form 
            className='flex flex-col gap-4'
        >
            <div 
                className="flex flex-col gap-4 sm:flex-row justify-between"
            >
                <TextInput
                    type='text'
                    id='title'
                    required
                    placeholder='Title'
                    className='flex-1'
                />
                <Select>
                    <option value='uncategorized'>Select  a category</option>
                    <option value='nutrition'>Nutrition and Healthy Eating </option>
                    <option value='fitness'>Fitness and Exercise</option>
                    <option value='mental'>Mental Health and Mindfulness</option>
                    <option value='lifestyle'>Lifestyle and Wellness Tips</option>
                </Select>
            </div>
            <div 
                className="flex gap-4 items-center justify-between border-2 border-teal-400 p-3 rounded-lg"
            >
                <FileInput
                    type='file'
                    accept='image/*'
                />
                <Button
                    type='button'
                    gradientDuoTone='purpleToBlue'
                    size='sm'
                    outline
                >
                    Upload Image
                </Button>
            </div>
            <ReactQuill 
                theme='snow'
                placeholder='Write your post here...'
                className='h-72 mb-12'
                required
            />
            <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
        </form>

    </div>
  )
}
