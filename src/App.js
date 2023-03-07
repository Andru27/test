import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import FileContent from './components/FileContent';

export class App extends React.Component {

  componentDidMount() {

    const urls = [`//api.github.com/users/as`, `//api.github.com/users/as/gists`];
    searchUsers(urls);

    document.getElementById('search').addEventListener('input', function () {

      let username = this.value;

      const urls = [`//api.github.com/users/${username}`, `//api.github.com/users/${username}/gists`];
      searchUsers(urls)
    });

    function searchUsers(urls) {
      Promise.all(urls.map(url =>
        fetch(url)
          .then(status)
          .then(json)
          .catch(error => console.log('Problem!', error))
      ))
        .then(data => {

          if (!data[0]) return;

          let user = data[0];
          let gists = data[1];

          let user_info = document.querySelector('.user-info');

          user_info.querySelector('.avatar img').setAttribute('src', user.avatar_url);
          user_info.querySelector('.name').innerHTML = user.name;
          user_info.querySelector('.login').innerHTML = user.login;
          user_info.querySelector('.bio').innerHTML = user.bio;

          let results = '';

          if (gists.length) {
            gists.forEach(gist => {

              let filename;

              Object.keys(gist.files).forEach((file_name) => {
                let file = gist.files[file_name]
                filename = file.filename;
              });

              results += `<div class='col-gist col-12'>
                <div class='col-inner'>
                  <div class='head'>
                    <div class='avatar'><img src="${gist.owner.avatar_url}" /></div>
                    <div class='result-info'>
                      <div class='title'>${gist.owner.login}/${filename}</div>
                      <div class='created_at'>Created ${years(gist.created_at)} years ago</div>
                    </div>
                  </div>
                  <div class='file_content'>{<FileContent />}</div>
                </div>
              </div>`;
            });
          }
          else {
            results = `<div class='col-gist col-12'>
              <div class='col-inner'>
                <h2>No Results found!!!</h2>
              </div>
            </div>`
          }

          document.querySelector('.results').innerHTML = results;
        })
    }

    function years(created_date) {
      let date = new Date(created_date);
      let format_created = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

      let created = new Date(format_created);
      var current_date = new Date();

      let created_at = (current_date.getTime() - created.getTime()) / (24 * 3600 * 1000);

      return (created_at) ? (created_at / 365).toFixed(0) : 0;
    }

    function status(response) {

      if (response.ok) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(new Error(response.statusText));
      }
    }

    function json(response) {
      return response.json();
    }
  }
  render() {
    return (
      <div className="user-gits">
        <div className='container'>
          <div className='row'>
            <div className="col-12">
              <div className="container-fluid">
                <div className="row">
                  <div className='search'>
                    <input id="search" type="text" defaultValue="as" />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-sidebar col-12 col-lg-2'>
              <div className='user-info'>
                <div className='avatar'><img src="" /></div>
                <div className='username'><span className='name'></span> <span className='login'></span></div>
                <div className='bio'></div>
              </div>
            </div>
            <div className='col-results col-12 col-lg-10'>
              <div className='results row'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;