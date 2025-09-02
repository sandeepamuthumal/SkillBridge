import React from 'react'
import ApplicationForm from './Components/ApplicationForm.jsx';

const PostJob = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Post Job</h1>
            <p className="text-muted-foreground">
              Post jobs the right way and find the perfect fit quickly.
            </p>
          </div>
        </div>

        <ApplicationForm />

      </div>
    </div>
  )
}

export default PostJob