import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import _ from "lodash";
import { getFieldsForUsers, getUser } from "../../../store/selectors";
import {
  deleteUser,
  saveUser,
  purchaseNumber,
  fetchUser
} from "../../../service";
import { editingUser } from "../../../store/actions";
import { getTeams } from "../../../../teams/store/selectors";
import { getRoles } from "../../../../roles/store/selectors";
import {
  renderGroupedFields,
  handleInputChange
} from "../../../../../utils/helpers/fields";

class Record extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formState: props.user.originalProps
    };
  }

  componentWillMount() {
    const { dispatch, match } = this.props;

    if (match.params.id === "new") {
      dispatch(editingUser());
    } else if (match.params.id > 0) {
      dispatch(fetchUser(match.params.id));
    }

    if (match.params.id > 0) {
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ formState: nextProps.user.originalProps });
  }

  _submit = () => {
    const { dispatch, match } = this.props;

    dispatch(saveUser(this.state.formState));

    if (match.params.id === "new") {
      dispatch(editingUser());
    }
  };

  _handleInputChange = event => {
    this.setState({
      formState: handleInputChange(
        event,
        this.state.formState,
        this.props.fields
      )
    });
  };

  _delete = () => {
    const { dispatch, user } = this.props;

    if (confirm("Are you sure?")) {
      dispatch(deleteUser(user.id));
    }
  };

  _purchaseNumber = () => {
    const { dispatch, user } = this.props;

    dispatch(purchaseNumber({ id: user.id })).then(res => {
      const event = {
        target: {
          name: "twilio_number",
          value: res.number
        }
      };

      this._handleInputChange(event);
    });
  };

  render() {
    const { user, teams, roles, fields } = this.props;
    const { formState } = this.state;
    const groups = _.groupBy(fields, "group");

    if (user.id === null && this.props.match.params.id !== "new") {
      return (
        <main className="col main-panel px-3 align-self-center">
          <h2 className="text-muted text-center">
            {this.context.i18n.t("messages.select.user.to.edit")}
          </h2>
        </main>
      );
    }

    const userHasNumber =
      _.findIndex(
        user.originalProps.custom_fields,
        f => f.custom_field_alias === "twilio_number"
      ) >= 0;

    const teamOptions = teams.map(t => ({ value: t.id, label: t.name }));
    const roleOptions = roles.map(r => ({ value: r.id, label: r.name }));
    const customFields = renderGroupedFields(
      true,
      ["quota", "weighting"],
      groups,
      user,
      this._handleInputChange,
      true
    );

    return (
      <main className="col main-panel px-3">
        <h4 className="border-bottom py-3">
          {userHasNumber || this.props.match.params.id === "new" ? (
            ""
          ) : (
            <button
              className="float-right btn btn-danger list-inline-item"
              onClick={this._purchaseNumber}
            >
              {this.context.i18n.t("messages.purchase.number")}
            </button>
          )}
          <button
            className="float-right btn btn-primary list-inline-item"
            onClick={this._submit}
          >
            {this.context.i18n.t("messages.save")}
          </button>
          {user.name
            ? user.name
            : this.context.i18n.t("messages.generic.new", {
                type: this.context.i18n.t("messages.user")
              })}
        </h4>

        <div className="h-scroll single-height">
          <div className="card mb-1">
            <ul className={`list-group list-group-flush`}>
              <li className="list-group-item">
                <div className={`form-group mb-2`}>
                  <label htmlFor="name" className="">
                    {this.context.i18n.t("messages.name")}
                  </label>
                  <div className="">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      onChange={this._handleInputChange}
                      className="form-control"
                      value={formState.name}
                    />
                  </div>
                </div>
                <div className={`form-group mb-2`}>
                  <label htmlFor="username" className="">
                    {this.context.i18n.t("messages.username")}
                  </label>
                  <div className="">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      onChange={this._handleInputChange}
                      className="form-control"
                      value={formState.username}
                    />
                  </div>
                </div>
                <div className={`form-group mb-2`}>
                  <label htmlFor="password" className="">
                    {this.context.i18n.t("messages.password")}
                  </label>
                  <div className="">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={this._handleInputChange}
                      className="form-control"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div className={`form-group mb-2`}>
                  <label htmlFor="second_password" className="">
                    {this.context.i18n.t("messages.password.confirm")}
                  </label>
                  <div className="">
                    <input
                      type="password"
                      id="second_password"
                      name="second_password"
                      onChange={this._handleInputChange}
                      className="form-control"
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>
                <div className={`form-group mb-2`}>
                  <label htmlFor="email" className="">
                    {this.context.i18n.t("messages.email")}
                  </label>
                  <div className="">
                    <input
                      type="text"
                      id="email"
                      name="email"
                      onChange={this._handleInputChange}
                      className="form-control"
                      value={formState.email}
                    />
                  </div>
                </div>
                <div className={`form-group mb-2`}>
                  <label htmlFor="phone" className="">
                    {this.context.i18n.t("messages.phone")}
                  </label>
                  <div className="">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      onChange={this._handleInputChange}
                      className="form-control"
                      value={formState.phone}
                    />
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="form-row">
                  <div className={`form-group mb-2 col-6`}>
                    <label htmlFor="team_id" className="">
                      {this.context.i18n.t("messages.team")}
                    </label>
                    <div className="">
                      <Select
                        name="team_id"
                        options={teamOptions}
                        value={formState.team_id}
                        onChange={value => {
                          const event = {
                            target: {
                              name: "team_id",
                              value: value ? value.value : ""
                            }
                          };

                          this._handleInputChange(event);
                        }}
                      />
                    </div>
                  </div>
                  <div className={`form-group mb-2 col-6`}>
                    <label htmlFor="roles" className="">
                      {this.context.i18n.t("messages.role")}
                    </label>
                    <div className="">
                      <Select
                        name="roles"
                        options={roleOptions}
                        value={formState.roles.map(r => r.id)}
                        multi={true}
                        onChange={value => {
                          const event = {
                            target: {
                              name: "roles",
                              value: value
                                ? value.map(v => ({ id: v.value }))
                                : []
                            }
                          };

                          this._handleInputChange(event);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            {customFields}
          </div>
        </div>
      </main>
    );
  }
}

Record.propTypes = {
  user: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired
};

Record.contextTypes = {
  i18n: PropTypes.object.isRequired
};

export default withRouter(
  connect((state, ownProps) => ({
    user: getUser(state, ownProps.match.params.id),
    teams: getTeams(state),
    roles: getRoles(state),
    fields: getFieldsForUsers(state)
  }))(Record)
);
