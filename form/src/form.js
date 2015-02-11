// by kejunz
var React        = require('react');
var assign       = require('react/lib/Object.assign');
var CitySelector = require('../../mods/CitySelector');

var TEXT_GENDER = {
  m: '男',
  f: '女'
}
var ERROR_MSG = {
  blank: {
    name: '请填写昵称',
    real_name: '请填写真实姓名',
    phone_num: '请填写电话',
    intro: '请详细填写个人介绍',
    loc_name: '请选择常居地',
    experience: '请详细填写你的摄影经历'
  }
};

module.exports = React.createClass({
  getInitialState: function() {
    var _default = {
      "birth_month":  "",
      "birth_year":   "",
      "experience":   "",
      "gender":       "",
      "signature":    "",
      "loc_name":     "",
      "loc_id":       0,
      "intro":        "",
      "name":         "",
      "phone_num":    "",
      "real_name":    "",
      "wechat":       ""
    };
    return {
      isProcessing: false,
      isEditable: false,
      fieldErrors: {
        name: null,
        real_name: null,
        phone_num: null,
        intro: null,
        loc_name: null,
        experience: null
      },
      data: assign({}, _default, this.props.data || {})
    }
  },
  render: function() {
    var isEditable = this.state.isEditable;
    var errors = this.state.fieldErrors;
    var data = this.state.data;
    var fieldName = (
        <li className="field">
        <label>昵称:</label>
        {
          isEditable ? <input name="name" onChange={this.handleInputChange} value={data.name} /> : _text(data.name)
        }
        { _error(errors.name) }
        </li> 
      );
    var fieldRealName = (
        <li className="field">
        <label>真实姓名:</label>
        {
          isEditable ? <input name="real_name" onChange={this.handleInputChange} value={data.real_name} /> : _text(data.real_name)
        }
        { _error(errors.real_name) }
        </li> 
      );
    var fieldGender = (
        <li className="field">
        <label>性别:</label>
        {
          isEditable ? (
                           <div className="sub-field" name="gender" onChange={this.handleInputChange}>
                             <input type="radio" id="sel-gender-f" name="gender" value="f" defaultChecked={ data.gender == 'f' } />
                             <label htmlFor="sel-gender-f">{ TEXT_GENDER.f }</label>
                             <input type="radio" id="sel-gender-m" name="gender" value="m" defaultChecked={ data.gender == 'm' } />
                             <label htmlFor="sel-gender-m">{ TEXT_GENDER.m }</label>
                           </div>
                       )
                    : TEXT_GENDER[_text(data.gender)]
         }
        </li>
      );
    var fieldBirthYear = _text(data.birth_year) + '年';
    var fieldBirthMonth = _text(data.birth_month) + '月';
    if (isEditable) {
      fieldBirthYear = (
         <select defaultValue={ data.birth_year }  name="birth_year" onChange={this.handleInputChange}>
          {
            (function() {
              var options = [];
              for (var i = 1970; i < 1996; i++) {
                options.push(<option value={i}>{i + '年'}</option>);
              }
              return options;
            })()
          }
        </select>
      );
      fieldBirthMonth = (
        <select defaultValue={ data.birth_month } name="birth_month" onChange={this.handleInputChange}>
          {
            (function() {
              var options = [];
              for (var i = 1; i <= 12; i++) {
                options.push(<option value={i}>{i + '月'}</option>);
              }
              return options;
            })()
          }
        </select>
      );
    }
    var fieldBirthday = (
        <li className="field">
          <label>出生年月:</label>
          { fieldBirthYear }
          { fieldBirthMonth }
        </li>
      );
    var fieldPhone = (
        <li className="field">
          <label>手机:</label>
          {
            isEditable ?  <input name="phone_num" onChange={this.handleInputChange} value={ data.phone_num } />
                     : _text(data.phone_num)
          }
        { _error(errors.phone_num) }
        </li>
      );
    var fieldWC = (
        <li className="field">
          <label>微信号:</label>
          {
            isEditable ?  <input name="weichat" onChange={this.handleInputChange} value={ data.weichat } />
                     : _text(data.weichat)
          }
        </li>
      );
    var fieldSignature = (
        <li className="field">
        <label>签名:</label>
          {
            isEditable ?  <input name="signature" onChange={this.handleInputChange} value={ data.signature } />
                     : _text(data.signature)
          }
        </li>
    );
    var fieldCity = (
        <li className="field">
        <label>常居地:</label>
          {
            isEditable ?  (
              <span>
              { data.loc_name }
              <a href="javascript:;" onClick={ this.handleClickCity }>[选择城市]</a>
              <CitySelector source={ this.props.locApi }
                            ref="citySelector"
                            onSelected={ this.handleCitySelected } />
              </span>
              )
                     : data.loc_name
          }
          { _error(errors.loc_name) }
        </li>
    );
    var fieldIntro = (
        <li className="field">
          <label>个人介绍:</label>
          {
            isEditable ?  <textarea name="intro" onChange={this.handleInputChange} cols="30" rows="20" value={data.intro} />
                     : <p>{ _text(data.intro) }</p>
          }
          { _error(errors.intro) }
        </li>
      );
    var fieldExp = (
        <li className="field">
          <label>专业经历:</label>
          {
            isEditable ?  <textarea name="experience" onChange={this.handleInputChange} cols="30" rows="20" value={ data.experience } />
                      : <p>{ _text(data.experience) }</p>
          }
          { _error(errors.experience) }
        </li>
      );
    var fieldSubmit = (
        <li className="field-submit">
        {
          isEditable ? <input type="submit" value="保存" onClick={this.handleSave} />
                      : <input type="submit" value="修改" onClick={this.handleModify} />
        }
        </li>
      );
    if (this.state.isProcessing) {
      fieldSubmit = (
          <li className="field-submit">
          正在保存...
          </li>
      );
    }
    var form = (
     <form className="info" onSubmit={this.handleSave}>
      <ul>
        {fieldName}
        {fieldRealName}
        {fieldGender}
        {fieldBirthday}
        {fieldPhone}
        {fieldWC}
        {fieldSignature}
        {fieldCity}
        {fieldIntro}
        {fieldExp}
        {fieldSubmit}
      </ul>
    </form>
    );
    function _text(text) {
      // 如果没有text，返回-
      // 把内容中的\n变成br标签
      // 否则返回text
      return text ? (/\n/.test(text) ? text.split(/\n/).map(function(t) { return <span>{t}<br /></span> }) : text) : ' - ';
    }
    function _error(msg) {
      return msg ? <div className="field-error">{ msg }</div> : null;
    }
    return <div>{ form }</div>
  },
  handleInputChange: function(e) {
    var data = this.state.data;
    data[e.target.name] = e.target.value;
    this.setState({
      data: data
    });
  },
  handleModify: function(e) {
    e.preventDefault();
    this.setState({
      isEditable: true
    });
  },
  handleClickCity: function() {
    this.refs.citySelector.open();
  },
  handleCitySelected: function(e) {
    var data = this.state.data;
    data.loc_name = e.name;
    data.loc_id = e.id;
    this.setState({
      data: data
    });
  },
  handleSave: function(e) {
    var hasError;
    e.preventDefault();
    if (this.state.isProcessing) {
      return;
    }
    var data = this.state.data;
    var errors = this.state.fieldErrors;
    for (var k in errors) {
      if (!data[k]) {
        errors[k] = ERROR_MSG.blank[k];
        hasError = true;
      } else {
        errors[k] = null;
      }
    }
    if (hasError) {
      this.setState({
        fieldErrors: errors
      });
      return;
    }
    this.setState({
      isProcessing: true
    });
    $.ajax({
      method: 'put',
      data: data,
      url: this.props.saveUrl,
      context: this
    }).done(function(e) {
      var errors = this.state.fieldErrors;
      if (e.errors) {
        for (var k in e.errors) {
          errors[k] = e.errors[k];
        }
      }
      this.setState({
        fieldErrors: errors,
        isProcessing: false,
        isEditable: false
      });
    });
  }
});