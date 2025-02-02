import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import getCurrencies from '../api';
import { fetchCurrencies, addExpenses, sumExpenses, shownExpense } from '../actions';

const initialState = {
  id: '',
  value: '',
  description: '',
  currency: undefined,
  method: '',
  tag: '',
  currencies: {},
  showBtnEdit: false,
};
class FormsWallet extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
    this.handleChange = this.handleChange.bind(this);
    this.handleClickAdd = this.handleClickAdd.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.showEditingOnScreen = this.showEditingOnScreen.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
    this.handleSelects = this.handleSelects.bind(this);
  }

  componentDidMount() {
    const { fetchCoins } = this.props;
    fetchCoins();
  }

  componentDidUpdate() {
    const { editedExpense } = this.props;
    if (editedExpense) {
      this.showEditingOnScreen();
    }
  }

  handleChange({ target: { value, name } }) {
    this.setState({
      [name]: value,
    });
  }

  async handleClickAdd() {
    const { value, description, currency = 'USD', method, tag, showBtnEdit } = this.state;

    const {
      expenses, editingExpense: { exchangeRates },
      addToExpenses, addSumExpenses } = this.props;

    if (!showBtnEdit) {
      const listCurrencies = await getCurrencies();
      const expense = {
        id: expenses.length,
        value,
        description,
        currency,
        method,
        tag,
        exchangeRates: listCurrencies,
      };
      addToExpenses(expense);
      addSumExpenses();
      this.setState(initialState);
    } else {
      const expense = {
        id: expenses.length,
        value,
        description,
        currency,
        method,
        tag,
        exchangeRates,
      };
      addToExpenses(expense);
      addSumExpenses();
      this.setState(initialState);
    }
  }

  handleClickEdit() {
    const { id, value, description, currency, method, tag } = this.state;
    const { addToExpenses, /* addSumExpenses, */
      editingExpense: { exchangeRates } } = this.props;
    const expense = {
      id,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates,
    };
    addToExpenses(expense);
    // addSumExpenses();
    this.setState(initialState);
  }

  handleInputs(labelName, inputName, inputValue) {
    return (
      <label htmlFor={ inputName }>
        { labelName }
        <input
          type="text"
          name={ inputName }
          id={ inputName }
          value={ inputValue }
          className={ inputName }
          data-testid={ `${inputName}-input` }
          onChange={ this.handleChange }
        />
      </label>

    );
  }

  handleSelects(labelName, selectName, selectValue, selectItems) {
    if (labelName === 'Moeda:') {
      return (
        <label htmlFor={ selectName }>
          { labelName }
          <select
            name={ selectName }
            id={ selectName }
            value={ selectValue }
            className={ selectName }
            data-testid={ `${selectName}-input` }
            onChange={ this.handleChange }
          >
            {selectItems.filter((coin) => coin !== 'USDT')
              .map((currency) => (
                <option key={ currency }>{ currency }</option>))}
          </select>
        </label>
      );
    }
    return (
      <label htmlFor={ selectName }>
        { labelName }
        <select
          name={ selectName }
          id={ selectName }
          value={ selectValue }
          className={ selectName }
          data-testid={ `${selectName}-input` }
          onChange={ this.handleChange }
        >
          <option>Selecione</option>
          {selectItems
            .map((currency) => (
              <option key={ currency }>{ currency }</option>))}
        </select>
      </label>
    );
  }

  showEditingOnScreen() {
    const { editingExpense: { id, value, description, currency, method, tag },
      handleShownExpense } = this.props;
    this.setState({
      id,
      value,
      description,
      currency,
      method,
      tag,
      showBtnEdit: true,
    });
    handleShownExpense();
  }

  render() {
    const { value, description, currency, method, tag, showBtnEdit } = this.state;
    const { currencies } = this.props;
    const methods = ['Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
    const tags = ['Alimentação', 'Lazer', 'Trabalho', 'Transporte', 'Saúde'];
    return (
      <div className={ (!showBtnEdit) ? 'formsWalletAdd' : 'formsWalletEdit' }>
        <div className="forms">
          {this.handleInputs('Valor:', 'value', value)}
          {this.handleSelects('Moeda:', 'currency', currency, currencies)}
          {this.handleSelects('Método de pagamento:', 'method', method, methods)}
          {this.handleSelects('Tag:', 'tag', tag, tags)}
          {this.handleInputs('Descrição:', 'description', description)}
        </div>
        <button
          type="button"
          data-testid="edit-btn"
          className={ (!showBtnEdit) ? 'addExpense' : 'editExpense' }
          onClick={ this.handleClickAdd }
        >
          {(!showBtnEdit) ? 'Adicionar despesa' : 'Editar despesa'}
        </button>
      </div>
    );
  }
}

FormsWallet.propTypes = {
  fetchCoins: PropTypes.func.isRequired,
  addToExpenses: PropTypes.func.isRequired,
  addSumExpenses: PropTypes.func.isRequired,
  handleShownExpense: PropTypes.func.isRequired,
  editedExpense: PropTypes.bool.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  expenses: PropTypes.arrayOf(PropTypes.object).isRequired,
  editingExpense: PropTypes.objectOf(PropTypes.string).isRequired,
};

const mapStateToProps = ({
  wallet: { currencies, expenses, editingExpense, editedExpense } }) => ({
  currencies,
  expenses,
  editingExpense,
  editedExpense,
});

const mapDispatchToProps = (dispatch) => ({
  fetchCoins: () => dispatch(
    fetchCurrencies(),
  ),
  addToExpenses: (expenses) => dispatch(
    addExpenses(expenses),
  ),
  addSumExpenses: () => dispatch(
    sumExpenses(),
  ),
  handleShownExpense: () => dispatch(
    shownExpense(),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormsWallet);
