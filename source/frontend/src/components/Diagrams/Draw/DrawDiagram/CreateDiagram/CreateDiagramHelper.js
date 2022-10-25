import React from 'react';
import { HelpPanel } from '@awsui/components-react';

const CreateDiagramHelper = () => {
  return (
    <HelpPanel header={<h2>Creating architecture diagrams</h2>}>
      <div>
        <p>Create an architecture diagram of AWS workloads</p>
        <h3>Create</h3>
        <p>
          Create a diagram containing the AWS resource shown in the preview.
          Give the diagram a name and select whether
        </p>

        <dl>
          <dt>Visibility</dt>
          <dd>
            Select <strong>Public</strong> to share the diagram with other
            Workload Discovery on AWS users.
          </dd>
          <dd>
            Select <strong>Private</strong> to keep the diagram visible only to
            this user.
          </dd>
          <dt>Name</dt>
          <dd>
            Give the diagram a name. It must be unique. If a diagram with the
            same name exists Workload Discovery on AWS will <strong>Overwrite</strong> it.
          </dd>
        </dl>
      </div>
    </HelpPanel>
  );
};

export default CreateDiagramHelper;
