import React, { Component } from 'react';

export class FileContent extends Component {
   constructor() {
      super()
      this.state = {
         file_content: '',
      };
   }
   render() {
      return 'file_content';
   }
}
export default FileContent