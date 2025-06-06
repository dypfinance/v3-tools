import React, { useState } from "react";
import moment from "moment";
import Address from "../../FARMINNG/address";
import getFormattedNumber from "../../../functions/get-formatted-number";
import "./governance-new.css";
import Modal from "../../Modal/Modal";
import WalletModal from "../../WalletModal";
import { shortAddress } from "../../../functions/shortAddress";
import axios from "axios";
import Tooltip from "@material-ui/core/Tooltip";

const {
  new_governancebsc: governance,
  new_governancebscdypv2: governancedypv2,
  reward_token,
  reward_token_dypius_bsc,
  BigNumber,
} = window;
const LP_AMPLIFY_FACTOR = 1;

let PoolGroupName = Object.freeze({
  WBNB: "0",
});

const stakingPools = [
  {
    logo: "/images/bnb.svg",
    name: "BNB Pools",
    group_name: PoolGroupName.WBNB,
    pools: [
      "0x537DC4fee298Ea79A7F65676735415f1E2882F92",
      "0x219717BF0bC33b2764A6c1A772F75305458BDA3d",
      "0xD1151a2434931f34bcFA6c27639b67C1A23D93Af",
      "0xed869Ba773c3F1A1adCC87930Ca36eE2dC73435d",
      "0x415B1624710296717FA96cAD84F53454E8F02D18",
    ],
  },
].map((pools) => {
  pools.pools = pools.pools
    .map((p) => p.toLowerCase())
    .sort()
    .join(",");
  return pools;
});

const AddProposal = (props) => {
  let [formState, setFormState] = useState({
    action: "3", // 0 - disburse or burn, 1 - upgrade governance
    stakingPool: stakingPools[0].pools,
    newGovernance: "",
    newQuorum: "",
    newMinBalance: "",
    text: "",
  });
  const [showModal, setShowModal] = useState(false);

  const setState = (obj) => setFormState({ ...formState, ...obj });
  let { isOwner, connected, isOpenModal } = props;
  return (
    <div className="col-12 col-lg-7">
      <div className="d-flex flex-column justify-content-between h-100 w-100">
        <div className="d-flex justify-content-start justify-content-lg-center gap-2 align-items-center my-3 col-12 col-lg-6">
          <h6
            className="submitnewproposal-title"
            style={{ paddingRight: "15px" }}
          >
            <img src={'https://cdn.worldofdypians.com/tools/submitwhite.svg'} alt="" />{" "}
            Submit new proposal
          </h6>
        </div>
        <form className="h-100">
          <div className="d-flex flex-column gap-2 align-items-end justify-content-between h-100">
            <h6 className="initialdesc col-12 col-lg-11">
              <b>Governed by the community</b>
              <br />
              Vote to add more pools, burn tokens, or allocate DYP toward
              grants, strategic partnerships, governance initiatives, and other
              programs.
            </h6>
            <div className="d-flex justify-content-start col-12 col-lg-11">
              <div
                className={
                  connected === false ? "btn disabled-btn" : "btn filledbtn"
                }
                style={{ width: "fit-content" }}
                disabled={connected === false ? true : false}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Create proposal
              </div>
            </div>
          </div>
        </form>
      </div>
      {showModal === true && isOpenModal === true && (
        <Modal
          visible={showModal}
          modalId="proposal"
          title="proposal"
          setIsVisible={() => {
            setShowModal(false);
          }}
          width="fit-content"
        >
          <div className="d-flex gap-2 flex-column justify-content-between align-items-start">
            <div>
              <label htmlFor="proposal-action" className="d-none">
                Select Action
              </label>
              <div className="d-flex justify-content-between gap-3 align-items-center">
                {/* <div className={"optionbtn-passive"}>
                  <label for="disburseburn" className="optiontext">
                    <img src={disburselogoPassive} alt="" />
                    Disburse or Burn
                  </label>
                </div> */}
                <div
                  className={
                    formState.action === "3"
                      ? "optionbtn-active"
                      : "optionbtn-passive"
                  }
                >
                  <input
                    type="checkbox"
                    value="3"
                    onChange={(e) => setState({ action: "3" })}
                    id="freetext"
                    className="d-none"
                  />
                  <label for="freetext" className="optiontext">
                    <img
                      src={
                        formState.action === "3"
                          ? "https://cdn.worldofdypians.com/tools/freetext-active.svg"
                          : "https://cdn.worldofdypians.com/tools/freetext-passive.svg"
                      }
                      alt=""
                    />
                    Other / Free Text
                  </label>
                </div>
              </div>
              <select
                value={formState.action}
                onChange={(e) => setState({ action: e.target.value })}
                className="form-control d-none"
                id="proposal-action"
              >
                <option value="0">Disburse or Burn</option>
                {isOwner && <option value="1">Upgrade Governance</option>}
                {isOwner && <option value="2">Change Quorum</option>}
                {isOwner && <option value="4">Change Min Balance</option>}
                <option value="3">Other / Free Text</option>
              </select>
            </div>
            {formState.action === "3" && (
              <div className="pt-3 w-100">
                <textarea
                  style={{
                    minHeight: "150px",
                    width: "100%",
                    background: "#312F69",
                    border: "1px solid #8E97CD",
                    color: "#F7F7FC",
                  }}
                  required
                  className="form-control"
                  type="text"
                  placeholder="Proposal Text"
                  value={formState.text}
                  onChange={(e) => setState({ text: e.target.value })}
                ></textarea>
              </div>
            )}

            {formState.action === "1" && (
              <div className="pt-3">
                <input
                  required
                  className="form-control"
                  type="text"
                  placeholder="New Governance Contract Address"
                  value={formState.newGovernance}
                  onChange={(e) => setState({ newGovernance: e.target.value })}
                />
              </div>
            )}
            {formState.action === "2" && (
              <div className="pt-3">
                <input
                  required
                  className="form-control"
                  type="number"
                  placeholder="New Quorum"
                  value={formState.newQuorum}
                  onChange={(e) => setState({ newQuorum: e.target.value })}
                />
              </div>
            )}

            {formState.action === "4" && (
              <div className="pt-3">
                <input
                  required
                  className="form-control"
                  type="number"
                  placeholder="New Min Balance"
                  value={formState.newMinBalance}
                  onChange={(e) => setState({ newMinBalance: e.target.value })}
                />
              </div>
            )}
            <div className="pt-3 d-flex flex-column gap-2">
              <h6 className="form-bottomtext">
                Submitting a proposal requires a minimum of
                <br />{" "}
                <b>
                  {getFormattedNumber(
                    props.MIN_BALANCE_TO_INIT_PROPOSAL / 1e18
                  )}{" "}
                  DYP{" "}
                </b>
                Governance Token Balance.
              </h6>
            </div>
            <div className="separator mb-1"></div>
            {["0", "1"].includes(formState.action) && (
              <div className="">
                <label htmlFor="staking-pool" className="d-none">
                  Select Pool
                </label>
                {stakingPools.map((v, i) => (
                  // <option value={v.pools} key={i}>
                  //   {" "}
                  //   {v ? v.name : "DYP"}{" "}
                  // </option>
                  <div key={i}>
                    <input
                      type="checkbox"
                      value={v.pools}
                      onChange={(e) =>
                        setState({ stakingPool: e.target.value })
                      }
                      id="stakingpool"
                      className="d-none"
                    />
                    <label for="stakingpool" className="d-none">
                      <img
                        src={
                          formState.stakingPool === stakingPools[0].pools
                            ? "https://cdn.worldofdypians.com/tools/checkGov.svg"
                            : "https://cdn.worldofdypians.com/tools/emptyGov.svg"
                        }
                        alt=""
                      />

                      <img
                        src={"https://cdn.worldofdypians.com/wod/avaxIcon.svg"}
                        alt=""
                        style={{ width: 18, height: 18 }}
                      />
                      {v ? v.name : "DYP"}
                    </label>
                  </div>
                ))}

                <select
                  className="form-control d-none"
                  id="staking-pool"
                  value={formState.stakingPool}
                  onChange={(e) => setState({ stakingPool: e.target.value })}
                >
                  {stakingPools.map((v, i) => (
                    <option value={v.pools} key={i}>
                      {" "}
                      {v ? v.name : "DYP"}{" "}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="d-flex gap-3 align-items-center justify-content-between w-100">
              <button
                className="btn loadmore-btn"
                type="submit"
                onClick={() => {
                  setShowModal(false);
                }}
                style={{ width: "45%" }}
              >
                Cancel
              </button>
              <button
                className={
                  formState.text === "" && formState.action === "3"
                    ? "btn disabled-btn"
                    : "btn filledbtn"
                }
                type="submit"
                onClick={props.onSubmit(formState)}
                disabled={
                  formState.text === "" && formState.action === "3"
                    ? true
                    : false
                }
              >
                SUBMIT PROPOSAL
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>

    // <div>
    //   <div
    //     className="l-box addProposal"
    //     style={{ marginTop: connected ? 43 : 0 }}
    //   >
    //     <h3 style={{ textAlign: "left" }}>Submit a proposal</h3>
    //     <form onSubmit={props.onSubmit(formState)}>
    //       <div>
    //         <label
    //           htmlFor="proposal-action"
    //           style={{ display: "none" }}
    //         ></label>
    //         <select
    //           value={formState.action}
    //           onChange={(e) => setState({ action: e.target.value })}
    //           className="form-control"
    //           id="proposal-action"
    //         >
    //           <option value="0">Disburse or Burn</option>
    //           {isOwner && <option value="1">Upgrade Governance</option>}
    //           {isOwner && <option value="2">Change Quorum</option>}
    //           {isOwner && <option value="4">Change Min Balance</option>}
    //           <option value="3">Other / Free Text</option>
    //         </select>
    //       </div>

    //       {["0", "1"].includes(formState.action) && (
    //         <div className="pt-3">
    //           <label htmlFor="staking-pool" className="d-flex">
    //             Select Pool
    //           </label>
    //           <select
    //             className="form-control"
    //             id="staking-pool"
    //             value={formState.stakingPool}
    //             onChange={(e) => setState({ stakingPool: e.target.value })}
    //           >
    //             {stakingPools.map((v, i) => (
    //               <option value={v.pools} key={i}>
    //                 {" "}
    //                 {v ? v.name : "DYP"}{" "}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       )}
    //       {formState.action == "1" && (
    //         <div className="pt-3">
    //           <input
    //             required
    //             className="form-control"
    //             type="text"
    //             placeholder="New Governance Contract Address"
    //             value={formState.newGovernance}
    //             onChange={(e) => setState({ newGovernance: e.target.value })}
    //           />
    //         </div>
    //       )}
    //       {formState.action == "2" && (
    //         <div className="pt-3">
    //           <input
    //             required
    //             className="form-control"
    //             type="number"
    //             placeholder="New Quorum"
    //             value={formState.newQuorum}
    //             onChange={(e) => setState({ newQuorum: e.target.value })}
    //           />
    //         </div>
    //       )}
    //       {formState.action == "3" && (
    //         <div className="pt-3">
    //           <textarea
    //             style={{ minHeight: "150px" }}
    //             required
    //             className="form-control"
    //             type="text"
    //             placeholder="Enter Proposal Text"
    //             value={formState.text}
    //             onChange={(e) => setState({ text: e.target.value })}
    //           ></textarea>
    //         </div>
    //       )}
    //       {formState.action == "4" && (
    //         <div className="pt-3">
    //           <input
    //             required
    //             className="form-control"
    //             type="number"
    //             placeholder="New Min Balance"
    //             value={formState.newMinBalance}
    //             onChange={(e) => setState({ newMinBalance: e.target.value })}
    //           />
    //         </div>
    //       )}
    //       <div className="pt-3">
    //         <button className="btn btn-primary btn-block" type="submit">
    //           SUBMIT PROPOSAL
    //         </button>
    //         <small className="form-text text-muted mt-4">
    //           {/*<i className='fas fa-info-circle'></i> */}Submitting a proposal
    //           requires a minimum of{" "}
    //           {(props.MIN_BALANCE_TO_INIT_PROPOSAL / 1e18).toFixed(2)} DYP
    //           Governance Token Balance.
    //         </small>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};

const ProposalCard = (props) => {
  return (
    <div className="container vault-container d-flex">
      <div className="row vault-row text-start justify-content-between p-1">
        <div
          className="text-center mb-2 d-flex align-items-center gap-3 justify-content-between"
          style={{ gap: 10 }}
        >
          <div className="d-flex justify-content-between gap-2 align-items-center">
            <img
              className="m-0 cardlogo"
              src={
                props.vault
                  ? props.vault.logo
                  : 'https://cdn.worldofdypians.com/tools/dyplogo.svg'
              }
              alt=''

            />

            <div
              style={{ whiteSpace: "pre-line", gap: 10 }}
              className="p-0 d-flex"
            >
              <span className="vault-name ">
                {props.vault ? props.vault.name : "DYP Proposal"}{" "}
              </span>
            </div>
          </div>
          {props._proposalAction !== "5" && (
            <div
              className={`${
                props._proposalAction === "3"
                  ? "actionwrapper2"
                  : props._proposalAction === "1"
                  ? "actionwrapper3"
                  : "actionwrapper"
              } col-sm-10 text-left`}
            >
              <span
                className={
                  props._proposalAction === "3"
                    ? "actionText2"
                    : props._proposalAction === "1"
                    ? "actionText3"
                    : "actionText"
                }
              >
                {{
                  0: "Disburse / Burn",
                  1: "Upgrade Governance",
                  2: "Change Quorum",
                  3: "Other / Free Text",
                  4: "Change Min Balance",
                }[props._proposalAction] || ""}
              </span>
            </div>
          )}
        </div>
        <div className="card-bottom-wrapper">
          <div className="text-left ExpireWrapper d-flex flex-column justify-content-start">
            <p className="expiretxt">Expires </p>
            <h6 className="duration-txt small mb-0 ">
              {moment
                .duration(
                  props._proposalStartTime * 1e3 +
                    window.config.vote_duration_in_seconds * 1e3 -
                    Date.now()
                )
                .humanize(true) === "a year ago"
                ? "one year ago"
                : moment
                    .duration(
                      props._proposalStartTime * 1e3 +
                        window.config.vote_duration_in_seconds * 1e3 -
                        Date.now()
                    )
                    .humanize(true)}
            </h6>
          </div>
          <div className="bnbchain">
            <span className="chaintext">
              BNB Chain
              <img
                src={"https://cdn.worldofdypians.com/wod/bnbIcon.svg"}
                alt=""
                className="chainlogo2"
              />
            </span>
          </div>
        </div>
      </div>
    </div>

    // <div
    //   className="container vault-container d-flex"
    //   id="example-collapse-text"
    // >
    //   <div className="row vault-row text-start justify-content-between p-1">
    //     <div
    //       className="col-sm-8 col-md-8 text-center mb-2 d-flex align-items-center gap-3 justify-content-start"
    //       style={{ gap: 10 }}
    //     >
    //       <img
    //         className="m-0 cardlogo"
    //         src={props.vault ? props.vault.logo : "/logo192.png"}
    //       />
    //       <div
    //         style={{ whiteSpace: "pre-line", gap: 10 }}
    //         className="col-sm-3 col-md-12 p-0 d-flex"
    //       >
    //         <span className="vault-name text-bold">
    //           {props.vault ? props.vault.name : "DYP Proposal"}{" "}
    //         </span>
    //         <div className="ethchain">
    //           <span className="chaintext">
    //             ETH Chain
    //             <img src={eth} alt="" className="chainlogo2" />
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="card-bottom-wrapper">
    //       <div className="text-left ExpireWrapper d-flex flex-column justify-content-startr">
    //         <p className="expiretxt">Expires</p>
    //         <p className="duration-txt small mb-0 ">
    //           {moment
    //             .duration(
    //               props._proposalStartTime * 1e3 +
    //                 window.config.vote_duration_in_seconds * 1e3 -
    //                 Date.now()
    //             )
    //             .humanize(true)}
    //         </p>
    //       </div>

    //       <div className="col-sm-10 text-left actionwrapper">
    //         <span className="actionText">
    //           {{
    //             0: "Disburse / Burn",
    //             1: "Upgrade Governance",
    //             2: "Change Quorum",
    //             3: "Other / Free Text",
    //             4: "Change Min Balance",
    //           }[props._proposalAction] || ""}
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

function getVaultByAddress(contract_address) {
  contract_address = contract_address.toLowerCase();
  let v = window.vaults.filter(
    (v) => v.contract_address.toLowerCase() === contract_address.toLowerCase()
  )[0];
  return v;
}

function getPoolForProposal(proposal) {
  let pools = proposal._stakingPool
    .map((p) => p.toLowerCase())
    .sort()
    .join(",");
  let p = stakingPools.filter((p) => p.pools === pools)[0];
  return p;
}

export default class Governance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proposals: [],
      step: 3,
      total_proposals: 0,
      isLoading: false,
      is_wallet_connected: false,
      token_balance: "",
      token_balanceDypv2: "",
      totalDeposited: "",
      totalDepositedDypv2: "",
      lastVotedProposalStartTime: "",
      QUORUM: "",
      coinbase: "0x0000000000000000000000000000000000000111",
      MIN_BALANCE_TO_INIT_PROPOSAL: "",
      open: false,
      proposalId: undefined,
      showModal: false,
      submitLoading: false,
      proposalData: "",
      submitStatius: "initial",
      showTYModal: false,
      isOpenModal: true,
    };
  }

  fetchProposals = async () => {
    await axios
      .get(`https://api.dyp.finance/api/gov-stats`)
      .then((res) => {
        this.setState({ proposalData: res.data });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  refreshProposals = async () => {
    if (
      this.state.isLoading &&
      this.state.proposals &&
      this.state.proposals?.length > 0 &&
      this.props.networkId === 56
    )
      return;
    this.setState({ isLoading: true });
    try {
      let total_proposals = Number(await governance?.lastIndex());
      let total_proposalsdypv2 = Number(await governancedypv2?.lastIndex());

      let proposals = this.state.proposals;
      let newProposals = [];
      let newProposalsDypv2 = [];

      let newProposals2 = [];

      for (let i = total_proposals; i >= 1; i--) {
        const checkproposal = await this.getProposal(i).then();
        if (checkproposal !== undefined) {
          newProposals.push(this.getProposal(i));
        } else {
          this.refreshProposals();
        }
      }

      for (let i = total_proposalsdypv2; i >= 1; i--) {
        const checkproposal2 = await this.getProposaldypv2(i).then();
        if (checkproposal2 !== undefined) {
          newProposalsDypv2.push(this.getProposaldypv2(i));
        } else {
          this.refreshProposals();
        }
      }

      newProposals = await Promise.all(newProposals);

      const newnewProposalsFinal = newProposals.map((item) => {
        return { ...item, is_v2: false };
      });

      newProposalsDypv2 = await Promise.all(newProposalsDypv2);

      const newProposalsDypv2Final = newProposalsDypv2.map((item) => {
        return { ...item, is_v2: true };
      });

      // newProposals = newProposals.map(p => {
      //     p.vault = getVaultByAddress(p._stakingPool)
      //     return p
      // })
      newProposals2 = proposals.concat(newnewProposalsFinal);

      const final_proposals = newProposalsDypv2Final.concat(newProposals2);

      this.setState({
        total_proposals: total_proposals + total_proposalsdypv2,
        isLoading: false,
      });
      this.setState({
        proposals: final_proposals,
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  refreshDYPBalance = async () => {
    if (this.props.connected === true && this.props.networkId === 56) {
      try {
        let coinbase = this.props.coinbase;
        await reward_token_dypius_bsc.balanceOf(coinbase).then((data) => {
          this.setState({
            token_balance: window.web3.utils.fromWei(data, "ether"),
          });
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  refreshBalance = async () => {
    if (this.props.connected === true && this.props.networkId === 56) {
      let coinbase = this.props.coinbase;

      try {
        let _totalDeposited = governance.totalDepositedTokens(coinbase);
        let _totalDepositedDypv2 =
          governancedypv2.totalDepositedTokens(coinbase);

        let _lvsTime = governancedypv2.lastVotedProposalStartTime(coinbase);
        let _q = governancedypv2.QUORUM();
        let _m = governancedypv2.MIN_BALANCE_TO_INIT_PROPOSAL();

        let [
          totalDeposited,
          totalDepositedDypv2,
          lastVotedProposalStartTime,
          QUORUM,
          MIN_BALANCE_TO_INIT_PROPOSAL,
        ] = await Promise.all([
          _totalDeposited,
          _totalDepositedDypv2,
          _lvsTime,
          _q,
          _m,
        ]);

        this.setState({
          totalDeposited,
          totalDepositedDypv2,
          lastVotedProposalStartTime,
          QUORUM,
          MIN_BALANCE_TO_INIT_PROPOSAL,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  getProposal = async (_proposalId) => {
    if (
      this.props.connected === true &&
      _proposalId &&
      this.props.networkId === 56
    ) {
      let p = await governance.getProposal(_proposalId);
      p.vault = getPoolForProposal(p);
      return p;
    }
  };

  getProposaldypv2 = async (_proposalId) => {
    if (
      this.props.connected === true &&
      _proposalId &&
      this.props.networkId === 56
    ) {
      let p = await governancedypv2.getProposal(_proposalId);
      p.vault = getPoolForProposal(p);
      return p;
    }
  };

  checkConnection = async () => {
    if (this.props.connected === true && this.props.networkId === 56) {
      this.setState({ is_wallet_connected: true });
      let coinbase = this.props.coinbase;
      this.setState({ coinbase: coinbase });
    }
    if (this.props.connected === false) {
      this.setState({ is_wallet_connected: false });
    }
  };
  componentDidMount() {
    this.refreshBalance();
    this.refreshDYPBalance();

    this.fetchProposals();
    if (
      this.state.proposals &&
      this.state.proposals?.length === 0 &&
      this.props.connected === true &&
      this.props.networkId === 56
    ) {
      this.refreshProposals();
      this.getProposal();
      this.getProposaldypv2();

      // window._refreshBalInterval2 = setInterval(this.getProposal, 3000);
    }
    this.checkConnection();
    this.getProposal();
    this.getProposaldypv2();

    window._refreshBalInterval = setInterval(this.checkConnection, 1000);

    window.gRefBalInterval = setInterval(this.refreshBalance, 7e3);
    window.gRefDYPBalInterval = setInterval(this.refreshDYPBalance, 3000);
  }

  componentWillUnmount() {
    clearInterval(window.gRefBalInterval);
    clearInterval(window.gRefDYPBalInterval);
    // clearInterval(window._refreshBalInterval2);
  }
  async shouldComponentUpdate(nextState) {
    if (nextState.connected !== this.props.connected) {
      await this.refreshProposals();
      return true;
    } else {
      return false;
    }
  }

  handleProposalSubmit = (formState) => (e) => {
    e.preventDefault();
    const min = this.state.MIN_BALANCE_TO_INIT_PROPOSAL / 1e18;
    if (Number(this.state.token_balance) < parseInt(min)) {
      window.alertify.error("Insufficient Governance Token Balance!");
      return;
    }
    let poolGroupName;

    let poolGroup;
    if (
      (poolGroup = stakingPools.filter((p) => {
        return p.pools === formState.stakingPool;
      })[0])
    ) {
      poolGroupName = poolGroup.group_name;
    }

    if (!poolGroupName) {
      window.alertify.error("Invalid pool selected");
      return;
    }

    if (formState.action === "0") {
      governancedypv2.proposeDisburseOrBurn(poolGroupName);
    } else if (formState.action === "1") {
      if (!window.web3.utils.isAddress(formState.newGovernance)) {
        window.alertify.error("Invalid Address!");
        return;
      }
      governancedypv2.proposeUpgradeGovernance(
        poolGroupName,
        formState.newGovernance
      );
    } else if (formState.action === "2") {
      let newQuorum = formState.newQuorum;
      if (isNaN(newQuorum * 1)) {
        window.alertify.error("Invalid quorum!");
        return;
      }
      newQuorum = new BigNumber(newQuorum).times(1e18).toFixed(0);
      governancedypv2.proposeNewQuorum(newQuorum);
    } else if (formState.action === "3") {
      governancedypv2
        .proposeText(formState.text)
        .then(() => {
          this.setState({ isOpenModal: false });
          setTimeout(() => {
            this.setState({ showTYModal: true });
          }, 1000);
        })
        .catch((e) => {
          console.error(e);
        });
    } else if (formState.action === "4") {
      let newMinBalance = formState.newMinBalance;
      if (isNaN(newMinBalance * 1)) {
        window.alertify.error("Invalid quorum!");
        return;
      }
      newMinBalance = new BigNumber(newMinBalance).times(1e18).toFixed(0);
      governancedypv2.proposeNewMinBalanceToInitProposal(newMinBalance);
    }
  };

  handleClaim = (e) => {
    e.preventDefault();
    governancedypv2.withdrawAllTokens();
  };

  handleProposals = async (e) => {
    e.preventDefault();
    await this.refreshProposals();
  };

  render() {
    let { totalDeposited, totalDepositedDypv2 } = this.state;
    totalDeposited = getFormattedNumber(totalDeposited / 1e18, 3);
    totalDepositedDypv2 = getFormattedNumber(totalDepositedDypv2 / 1e18, 3);

    let canWithdrawAll = false;
    let withdrawableTitleText = "";
    let canWithdrawAllAfter =
      this.state.lastVotedProposalStartTime * 1e3 +
      window.config.vote_duration_in_seconds * 1e3;

    if (Date.now() > canWithdrawAllAfter) {
      canWithdrawAll = true;
    } else if (Date.now() < canWithdrawAllAfter) {
      withdrawableTitleText =
        `You'll be able to withdraw ` +
        moment.duration(canWithdrawAllAfter - Date.now()).humanize(true);
    }
    let noVotes = localStorage.getItem("NoVoteseth");
    // console.log(this.state.token_balance)

    let isOwner =
      String(this.state.coinbase).toLowerCase() ===
      window.config.admin_address.toLowerCase();
    const deviceWidth = window.innerWidth;

    let expireArray = [];
    let expires;
    for (let i = 0; i <= this.state.proposals?.length - 1; i++) {
      let endsOn =
        this.state.proposals[i]?._proposalStartTime * 1e3 +
        window.config.vote_duration_in_seconds * 1e3;

      expires = moment.duration(endsOn - Date.now()).humanize(true);
      expireArray[i] = expires;
    }

    return (
      <div>
        <div
          className={deviceWidth < 500 ? "container-lg" : "container-lg p-0"}
        >
          <div className="d-flex flex-column flex-xxl-row justify-content-between gap-2 align-items-start">
            <div className="col-12 col-xxl-7">
              <h6 className="govtitle mb-3">Dypius Governance</h6>
              <h6 className="govdesc mb-3">
                DYP tokens represent voting shares in Dypius Governance. The
                introduction of DYP tokens enables shared community ownership of
                a vibrant, diverse, and dedicated governance system which will
                actively guide the protocol toward the future. <br />
                <br />
                Through governance, DYP holders can vote to add more pools, burn
                tokens, or allocate DYP toward grants, strategic partnerships,
                governance initiatives, and other programs.
              </h6>
            </div>

            <div className="col-12 col-xxl-4 flex-column d-flex justify-content-between gap-2">
              <div className="d-flex  w-100 justify-content-center gap-2">
                <div className="totalproposals col-4">
                  <img
                    src={"https://cdn.worldofdypians.com/wod/eth.svg"}
                    alt=""
                    className="chainlogo"
                  />
                  <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                    <h6 className="chaintitle">Ethereum</h6>
                    <h6 className="totalpoolsnr">
                      {this.state.proposalData.proposals?.eth}
                    </h6>
                    <h6 className="totalproposals-text">Total proposals</h6>
                  </div>
                </div>
                <div className="totalproposals col-4">
                  <img
                    src={"https://cdn.worldofdypians.com/wod/bnbIcon.svg"}
                    alt=""
                    className="chainlogo"
                  />
                  <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                    <h6 className="chaintitle">BNB Chain</h6>
                    <h6 className="totalpoolsnr">
                      {this.state.proposalData.proposals?.bsc}
                    </h6>
                    <h6 className="totalproposals-text">Total proposals</h6>
                  </div>
                </div>
                <div className="totalproposals col-4">
                  <img
                    src={"https://cdn.worldofdypians.com/wod/avaxIcon.svg"}
                    alt=""
                    className="chainlogo"
                  />
                  <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
                    <h6 className="chaintitle">Avalanche</h6>
                    <h6 className="totalpoolsnr">
                      {this.state.proposalData.proposals?.avax}
                    </h6>
                    <h6 className="totalproposals-text">Total proposals</h6>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 col-xl-12 flex-column flex-lg-row  mt-5 d-flex justify-content-start justify-content-lg-between align-items-center total-proposals-wrapper position-relative p-3">
                <div className="purplediv" style={{ left: "0" }}></div>
                <div className="d-flex flex-row align-items-center w-100 gap-2">
                  <img
                    src={
                      "https://cdn.worldofdypians.com/tools/totalVotesIcon.svg"
                    }
                    alt=""
                  />
                  <div className="d-flex flex-column  gap-1">
                    <span className="total-gov-votes">Total</span>
                    <span className="total-gov-votes w-100">
                      Governance Votes
                    </span>
                  </div>
                </div>
                <div className="total-votes">
                  {getFormattedNumber(this.state.proposalData?.totalVotes)}
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-lg-row justify-content-between gap-4 gap-lg-2 cardwrapper mt-4 mb-4">
            <div className="govcard1 col-12 col-lg-3">
              <div className="purplediv"></div>
              <div className="d-flex flex-column gap-2">
                <img
                  src={"https://cdn.worldofdypians.com/tools/walleticon.svg"}
                  alt=""
                  style={{ width: 40, height: 40 }}
                />
                <div className="d-flex justify-content-between gap-2 align-items-baseline position-relative">
                  <h6 className="govcard-title">Connect wallet</h6>
                  <h6 className="govcard-number">1</h6>
                </div>
                <h6 className="govcard-desc">
                  Dypius Governance is available on Ethereum, BNB Chain and
                  Avalanche. Connect your wallet to get started.
                </h6>
              </div>
            </div>
            <div className="govcard2 col-12 col-lg-3">
              <div className="greendiv"></div>
              <div className="d-flex flex-column gap-2">
                <img
                  src={"https://cdn.worldofdypians.com/tools/copy.svg"}
                  alt=""
                  style={{ width: 40, height: 40 }}
                />
                <div className="d-flex justify-content-between gap-2 align-items-baseline position-relative">
                  <h6 className="govcard-title">Create proposal</h6>
                  <h6 className="govcard-number">2</h6>
                </div>
                <h6 className="govcard-desc">
                  Propose new pools, allocate DYP for grants, partnerships,
                  initiatives, and more.
                </h6>
              </div>
            </div>
            <div className="govcard3 col-12 col-lg-3">
              <div className="orangediv"></div>
              <div className="d-flex flex-column gap-2">
                <img
                  src={"https://cdn.worldofdypians.com/tools/submit.svg"}
                  alt=""
                  style={{ width: 40, height: 40 }}
                />
                <div className="d-flex justify-content-between gap-2 align-items-baseline position-relative">
                  <h6 className="govcard-title">Submit</h6>
                  <h6 className="govcard-number">3</h6>
                </div>
                <h6 className="govcard-desc">
                  Submitting a Governance proposal requires a minimum of{" "}
                  {getFormattedNumber(
                    this.state.MIN_BALANCE_TO_INIT_PROPOSAL / 1e18
                  )}
                  DYP token balance
                </h6>
              </div>
            </div>
          </div>

          <div>
            <h6 className="myDetails-title mb-3">New proposal</h6>
            <div className="d-flex justify-content-center justify-content-lg-end mb-5 gap-5 align-items-center position-relative">
              <img
                src={"https://cdn.worldofdypians.com/tools/govhero.png"}
                alt=""
                className="project-banner2"
              />
              <div
                className="row submitproposal-wrapper gap-4 gap-lg-0"
                id="votingWrapper"
              >
                <AddProposal
                  isOwner={isOwner}
                  isOpenModal={this.state.isOpenModal}
                  connected={this.state.is_wallet_connected}
                  MIN_BALANCE_TO_INIT_PROPOSAL={
                    this.state.MIN_BALANCE_TO_INIT_PROPOSAL
                  }
                  onSubmit={this.handleProposalSubmit}
                  coinbase={this.state.coinbase}
                  handleConnection={() => {
                    this.props.handleConnection();
                  }}
                />
                <div className="mydetails-wrapper col-12 col-lg-4">
                  <div className="d-flex justify-content-between flex-column gap-4 gap-lg-0">
                    <div className="d-flex justify-content-start justify-content-lg-end">
                      {this.state.is_wallet_connected === false ? (
                        <button
                          className="connectbtn btn mb-3"
                          onClick={() => {
                            this.setState({ showModal: true });
                          }}
                        >
                          <img
                            src={'https://cdn.worldofdypians.com/tools/walletIcon.svg'}
                            alt=""
                          />{" "}
                          Connect wallet
                        </button>
                      ) : (
                        <div className="d-flex w-100 gap-2 mb-2">
                          <h6 className="change-chain-text">
                            To change chain
                            <br />
                            go to your wallet*
                          </h6>
                          <div
                            className="bnbchain position-relative"
                            style={{ right: "auto" }}
                          >
                            <span className="chaintext">
                              BNB Chain
                              <img
                                src={
                                  "https://cdn.worldofdypians.com/wod/bnbIcon.svg"
                                }
                                alt=""
                                className="chainlogo2"
                                style={{ top: "-1px" }}
                              />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="d-flex justify-content-between gap-2 align-items-center mb-3">
                      <div className="colored-container">
                        <span className="purpletext">
                          <img
                            src={'https://cdn.worldofdypians.com/tools/wallet2.svg'}
                            alt=""
                          />{" "}
                          My DYPv2 Balance
                        </span>
                        <span className="whitetext">
                          {getFormattedNumber(this.state.token_balance)} DYP
                        </span>
                      </div>
                      <div className="colored-container">
                        <span className="purpletext">
                          <img
                            src={'https://cdn.worldofdypians.com/tools/votes.svg'}
                            alt=""
                          />
                          My number of votes
                        </span>
                        <span className="whitetext">
                          {noVotes === null ? 0 : noVotes} DYP
                        </span>
                      </div>
                    </div>

                    <form className="" onSubmit={this.handleClaim}>
                      <div className="form-group2">
                        <label
                          htmlFor="deposit-amount"
                          className="text-left d-block totalvoting"
                        >
                          Total in voting
                        </label>
                        <div className="d-flex flex-column align-items-start w-100">
                          <div className="d-flex justify-content-between align-items-center gap-5 w-100">
                            <div className="form-row totalVotingButton">
                              <div>
                                <span className="dypamounttext">
                                  {totalDepositedDypv2} DYP
                                </span>
                              </div>
                            </div>

                            <button
                              title={withdrawableTitleText}
                              disabled={
                                !canWithdrawAll ||
                                totalDepositedDypv2 === "0.000"
                              }
                              className={`btn filledbtn ${
                                (!canWithdrawAll ||
                                  totalDepositedDypv2 === "0.000") &&
                                "disabled-btn"
                              } `}
                              type="submit"
                            >
                              Withdraw all
                            </button>
                          </div>
                          <h6 className="errormsg">{withdrawableTitleText}</h6>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {this.state.showModal && (
              <WalletModal
                show={this.state.showModal}
                handleClose={() => {
                  this.setState({ showModal: false });
                }}
                handleConnection={() => {
                  this.props.handleConnection();
                  this.setState({ showModal: false });
                }}
              />
            )}
          </div>
          <div
            className="row pb-5 m-0"
            style={{ flexDirection: "column-reverse" }}
          >
            <div className={`col-lg-12 p-0 `}>
              {/* {this.state.is_wallet_connected === false && (
                <div className="errorWrapper">
                  <span>
                    You need to connect your wallet in order to see the
                    proposals
                  </span>
                </div>
              )} */}

              {this.state.is_wallet_connected === true ? (
                <div className="mb-4">
                  <h6 className="myDetails-title mb-3">All proposals</h6>

                  <div
                    className="accordion  governanceWrapper"
                    id="accordionExample"
                  >
                    {this.state.proposals && this.state.proposals.length > 0 ? (
                      this.state.proposals
                        .slice(0, this.state.step)
                        .map((props, index) => (
                          <div
                            className="accordion-item position-relative"
                            key={index}
                            style={{ border: "none" }}
                          >
                            {expireArray[index].includes("ago") ? (
                              <img
                                src={'https://cdn.worldofdypians.com/tools/expired.png'}
                                alt=""
                                className="acordionstate"
                              />
                            ) : (
                              <img
                                src={'https://cdn.worldofdypians.com/tools/newPool.png'}
                                alt=""
                                className="acordionstate"
                                style={{ scale: "0.67" }}
                              />
                            )}
                            <div className="accordion-header" id="headingOne">
                              <button
                                className="accordion-button collapsed d-flex flex-column position-relative "
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#${"collapse" + index}`}
                                aria-expanded="true"
                                aria-controls={"collapse" + index}
                                onClick={() => {
                                  this.setState({
                                    proposalId: props?._proposalId,
                                  });
                                }}
                                style={{
                                  margin: "auto",
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                }}
                              >
                                <div className="purplediv"></div>
                                <ProposalCard {...props} />
                              </button>
                            </div>

                            <div
                              id={"collapse" + index}
                              className="accordion-collapse collapse"
                              aria-labelledby={"collapsed" + index}
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body px-2">
                                <ProposalDetails
                                  refreshBalance={this.refreshBalance}
                                  proposalId={props?._proposalId}
                                  connected={this.props.connected}
                                  coinbase={this.props.coinbase}
                                  networkId={this.props.networkId}
                                  is_v2={props.is_v2}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <>
                        <div className="emptycard"></div>
                        <div className="emptycard"></div>
                        <div className="emptycard"></div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="governanceWrapper">
                  <div className="emptycard"></div>
                  <div className="emptycard"></div>
                  <div className="emptycard"></div>
                </div>
              )}

              <div className="text-center">
                {this.state.proposals.slice(0, this.state.step)?.length <
                  this.state.total_proposals &&
                  this.state.is_wallet_connected === true && (
                    <button
                      className="btn loadmore-btn"
                      style={{
                        fontSize: ".8rem",
                        background: "transparent",
                      }}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ step: this.state.step + 3 });
                        // this.refreshProposals()
                      }}
                    >
                      {this.state.isLoading ? "Loading..." : "Load more"}
                    </button>
                  )}

                {!this.state.isLoading &&
                  this.state.proposals?.length === 0 &&
                  this.state.is_wallet_connected === true && (
                    <div className="pt-5">
                      <p>No Proposals to Display</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {this.state.showTYModal === true && (
          <Modal
            visible={this.state.showTYModal}
            modalId="tymodal"
            title="ty"
            setIsVisible={() => {
              this.setState({ showTYModal: false });
            }}
            width="fit-content"
          >
            <img
              src={"https://cdn.worldofdypians.com/tools/tyhero.png"}
              alt=""
              className="tyHero"
            />
            <h6 className="ty-title">Thank you</h6>
            <h6 className="ty-subtitle">
              Your proposal submitted successfully
            </h6>
          </Modal>
        )}
      </div>

      //       <div>
      //         <div
      //           className={
      //             deviceWidth < 500 ? "container-lg" : "container-lg p-0"
      //           }
      //         >
      //           <div className="d-flex flex-column flex-xxl-row justify-content-between gap-2 align-items-start">
      //             <div className="col-12 col-xxl-7">
      //               <h6 className="govtitle mb-3">Dypius Governance</h6>
      //               <h6 className="govdesc mb-3">
      //                 DYP tokens represent voting shares in Dypius Governance. The
      //                 introduction of DYP tokens enables shared community ownership of
      //                 a vibrant, diverse, and dedicated governance system which will
      //                 actively guide the protocol toward the future. <br />
      //                 <br />
      //                 Through governance, DYP holders can vote to add more pools, burn
      //                 tokens, or allocate DYP toward grants, strategic partnerships,
      //                 governance initiatives, and other programs.
      //               </h6>
      //             </div>

      //             <div className="col-12 col-xxl-4 flex-column d-flex justify-content-between gap-2">
      //               <div className="d-flex  w-100 justify-content-center gap-2">
      //               <div className="totalproposals col-4">
      //                 <img src={eth} alt="" className="chainlogo" />
      //                 <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
      //                   <h6 className="chaintitle">Ethereum</h6>
      //                   <h6 className="totalpoolsnr">{this.state.proposalData.proposals?.eth}</h6>
      //                   <h6 className="totalproposals-text">Total proposals</h6>
      //                 </div>
      //               </div>
      //               <div className="totalproposals col-4">
      //                 <img src={bnb} alt="" className="chainlogo" />
      //                 <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
      //                   <h6 className="chaintitle">BNB Chain</h6>
      //                   <h6 className="totalpoolsnr">{this.state.proposalData.proposals?.bsc}</h6>
      //                   <h6 className="totalproposals-text">Total proposals</h6>
      //                 </div>
      //               </div>
      //               <div className="totalproposals col-4">
      //                 <img src={avax} alt="" className="chainlogo" />
      //                 <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
      //                   <h6 className="chaintitle">Avalanche</h6>
      //                   <h6 className="totalpoolsnr">{this.state.proposalData.proposals?.avax}</h6>
      //                   <h6 className="totalproposals-text">Total proposals</h6>
      //                 </div>
      //               </div>
      //               </div>
      //               <div className="col-6 col-xl-12 mt-5 d-flex justify-content-between align-items-center total-proposals-wrapper position-relative p-3">
      //                 <div className="purplediv" style={{left: '0'}}></div>
      //                 <div className="d-flex align-items-center gap-2">
      //                     <img src={totalVotesIcon} alt="" />
      //                    <div className="d-flex flex-column gap-1">
      //                    <span className="total-gov-votes">Total</span>
      //                     <span className="total-gov-votes">Governance Votes</span>
      //                    </div>
      //                 </div>
      //                 <div className="total-votes">{getFormattedNumber(this.state.proposalData?.totalVotes)}</div>
      //               </div>
      //             </div>
      //           </div>
      //           <div className="d-flex justify-content-between gap-2 cardwrapper mt-4 mb-4">
      //             <div className="govcard1 col-3">
      //               <div className="purplediv"></div>
      //               <div className="d-flex flex-column gap-2">
      //                 <img
      //                   src={'https://cdn.worldofdypians.com/tools/walleticon.svg'}
      //                   alt=""
      //                   style={{ width: 40, height: 40 }}
      //                 />
      //                 <div className="d-flex justify-content-between gap-2 align-items-baseline position-relative">
      //                   <h6 className="govcard-title">Connect wallet</h6>
      //                   <h6 className="govcard-number">1</h6>
      //                 </div>
      //                 <h6 className="govcard-desc">
      //                   Dypius Governance runs on Ethereum, BNB Chain, and Avalanche.
      //                   Connect your wallet to get started
      //                 </h6>
      //               </div>
      //             </div>
      //             <div className="govcard2 col-3">
      //               <div className="greendiv"></div>
      //               <div className="d-flex flex-column gap-2">
      //                 <img src={copy} alt="" style={{ width: 40, height: 40 }} />
      //                 <div className="d-flex justify-content-between gap-2 align-items-baseline position-relative">
      //                   <h6 className="govcard-title">Create proposal</h6>
      //                   <h6 className="govcard-number">2</h6>
      //                 </div>
      //                 <h6 className="govcard-desc">
      //                   The proposal can be related to disbursing/burning tokens, or
      //                   other suggestions
      //                 </h6>
      //               </div>
      //             </div>
      //             <div className="govcard3 col-3">
      //               <div className="orangediv"></div>
      //               <div className="d-flex flex-column gap-2">
      //                 <img src={submit} alt="" style={{ width: 40, height: 40 }} />
      //                 <div className="d-flex justify-content-between gap-2 align-items-baseline position-relative">
      //                   <h6 className="govcard-title">Submit</h6>
      //                   <h6 className="govcard-number">3</h6>
      //                 </div>
      //                 <h6 className="govcard-desc">
      //                   Submitting a proposal requires a minimum of 5000 DYP
      //                   Governance token balance
      //                 </h6>
      //               </div>
      //             </div>
      //           </div>

      //             <div
      //               className="col-lg-12 p-0"
      //               id="votingWrapper"
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 gap: 20,
      //                 alignItems: 'center'
      //               }}
      //             >
      //               <AddProposal
      //                 isOwner={isOwner}
      //                 connected={this.state.is_wallet_connected}
      //                 MIN_BALANCE_TO_INIT_PROPOSAL={
      //                   this.state.MIN_BALANCE_TO_INIT_PROPOSAL
      //                 }
      //                 onSubmit={this.handleProposalSubmit}
      //               />

      // <div
      //             className={`${
      //               !this.state.is_wallet_connected
      //                 ? "containertop"
      //                 : "connectWallet-blue d-block d-md-flex"
      //             }`}
      //           >
      //             {this.state.is_wallet_connected === false ? (
      //               <>
      //                 <span style={{ display: "flex" }}>My Wallet</span>
      //                 <div className="connectWallet">
      //                   <h3 className="titleWrapper">
      //                     Please connect wallet to use this dApp
      //                   </h3>
      //                   <button
      //                     onClick={() => {
      //                       this.props.handleConnection();
      //                     }}
      //                     style={{ borderRadius: "6px" }}
      //                     className="btn connectWalletBTN pr-5 pl-5"
      //                   >
      //                     Connect Wallet
      //                   </button>
      //                 </div>
      //               </>
      //             ) : (
      //               <div>
      //                 <div className="d-flex justify-content-between">
      //                   <div className="colored-container">
      //                     <span>My DYP Balance</span>
      //                     {/* <img src={walletLogo} color="white" alt="wallet-icon" /> */}
      //                     &nbsp; &nbsp; &nbsp;{" "}
      //                     <span>{this.state.token_balance} DYP</span>
      //                   </div>
      //                   <div className="colored-container">
      //                     <span>
      //                       My NO Votes &nbsp; {noVotes == null ? 0 : noVotes} DYP
      //                     </span>
      //                   </div>
      //                 </div>
      //                 <div className="l-box col-lg-7 totalVoting">
      //                   <form className="" onSubmit={this.handleClaim}>
      //                     <div className="form-group">
      //                       <label
      //                         htmlFor="deposit-amount"
      //                         className="text-left d-block"
      //                       >
      //                         Total in voting
      //                       </label>
      //                       <div className="row buttonWrapper">
      //                         <div
      //                           className="form-row totalVotingButton"
      //                           style={{
      //                             maxWidth: 180,
      //                             width: "100%",
      //                           }}
      //                         >
      //                           <div className="col-12">
      //                             <p
      //                               className="form-control  text-right"
      //                               style={{
      //                                 border: "none",
      //                                 marginBottom: 0,
      //                                 paddingLeft: 0,
      //                                 background: "rgba(82, 168, 164, 0.2)",
      //                                 color: "var(--text-color)",
      //                               }}
      //                             >
      //                               <span
      //                                 style={{
      //                                   fontSize: "1.2rem",
      //                                   color: "var(--text-color)",
      //                                 }}
      //                               >
      //                                 {totalDeposited}
      //                               </span>{" "}
      //                               <small className="text-bold">DYP</small>
      //                             </p>
      //                           </div>
      //                         </div>

      //                         <button
      //                           title={withdrawableTitleText}
      //                           disabled={!canWithdrawAll}
      //                           className="btn btn-primary btn-block l-outline-btn withdrawButton"
      //                           type="submit"
      //                           style={{ maxWidth: 180 }}
      //                         >
      //                           Withdraw all
      //                         </button>
      //                       </div>
      //                     </div>
      //                   </form>
      //                 </div>
      //               </div>
      //             )}
      //           </div>

      //             </div>
      //           <div className="row pb-5 m-0">
      //             <div className={`col-lg-12 p-0 governanceWrapper`}>
      //               {this.state.is_wallet_connected === undefined && (
      //                 <div className="errorWrapper">
      //                   <span>
      //                     You need to connect your wallet in order to see the
      //                     proposals
      //                   </span>
      //                 </div>
      //               )}

      //               {this.state.is_wallet_connected === true ? (
      //                 this.state.proposals.map((props, i) => (
      //                   <div
      //                     className=" proposalscard"
      //                     key={i}
      //                     onClick={() => {
      //                       this.setState({ open: true });
      //                       this.setState({
      //                         proposalId: this.state.total_proposals - i,
      //                       });
      //                     }}
      //                   >
      //                     <div className="purplediv"></div>
      //                     <ProposalCard {...props} />
      //                   </div>
      //                 ))
      //               ) : (
      //                 <div className="col-lg-12 row justify-content-between p-0 ml-0"></div>
      //               )}

      //               <div className="text-center">
      //                 {this.state.proposals.length < this.state.total_proposals && (
      //                   <button
      //                     className="btn btn-primary l-outline-btn bgt"
      //                     style={{
      //                       fontSize: ".8rem",
      //                       background: "transparent",
      //                     }}
      //                     href="#"
      //                     onClick={(e) => {
      //                       e.preventDefault();
      //                       this.refreshProposals();
      //                     }}
      //                   >
      //                     {this.state.isLoading ? "LOADING..." : "LOAD MORE"}
      //                   </button>
      //                 )}

      //                 {!this.state.isLoading && this.state.proposals.length == 0 && (
      //                   <div className="pt-5">
      //                     <p>No Proposals to Display</p>
      //                   </div>
      //                 )}
      //               </div>
      //             </div>
      //           </div>

      //           {this.state.open === true && (
      //             <ProposalDetails
      //               refreshBalance={this.refreshBalance}
      //               proposalId={
      //                 this.state.proposalId === undefined ? 0 : this.state.proposalId
      //               }
      //             />
      //           )}
      //         </div>
      //       </div>
    );
  }
}

class ProposalDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      depositAmount: "",
      withdrawAmount: "",
      depositedTokens: "",
      depositedTokens_old: "",

      token_balance: "",
      token_balance_old: "",

      coinbase: "",
      totalDeposited: "",
      totalDeposited_old: "",
      option: "1", // 0, 1.  0 = yes/disburse, 1 = no/burn
      lastVotedProposalStartTime: "",
      QUORUM: "",
      MIN_BALANCE_TO_INIT_PROPOSAL: "",
      MIN_BALANCE_TO_INIT_PROPOSAL_OLD: "",

      is_wallet_connected: false,
      is_proposal_executible: false,
      open: false,
      z: false,
      proposal: {},

      depositLoading: false,
      depositStatus: "initial",
      removeLoading: false,
      removeStatus: "initial",
      errorMsg: "",
      errorMsg2: "",
      showWalletModal: false,
    };
  }
  componentDidMount() {
    this.refreshBalance();
    this.refreshProposal();
    // this.getProposal()
    this.checkConnection();
    window._refreshBalInterval = setInterval(this.checkConnection, 3000);
    // window._refreshBalInterval2 = setInterval(this.getProposal, 3000);

    // window._refreshVoteBalInterval = setInterval(this.refreshProposal, 3000);
  }

  componentWillUnmount() {
    // this.checkConnection();
    clearInterval(window._refreshVoteBalInterval);
    // clearInterval(window._refreshBalInterval2);
  }

  refreshProposal = () => {
    if (this.props.proposalId && this.props.networkId === 56) {
      if (this.props.is_v2 === true) {
        this.getProposaldypv2(this.props.proposalId)
          .then((proposal) => this.setState({ proposal }))
          .catch(console.error);
      } else if (this.props.is_v2 === false) {
        this.getProposal(this.props.proposalId)
          .then((proposal) => this.setState({ proposal }))
          .catch(console.error);
      }
    }
  };

  getProposal = async (_proposalId) => {
    if (_proposalId && this.props.networkId === 56) {
      let p = await governance.getProposal(_proposalId);
      p.vault = getPoolForProposal(p);
      return p;
    }
  };

  getProposaldypv2 = async (_proposalId) => {
    if (_proposalId && this.props.networkId === 56) {
      let p = await governancedypv2.getProposal(_proposalId);
      p.vault = getPoolForProposal(p);
      return p;
    }
  };

  handleApprove = (e) => {
    // e.preventDefault();
    this.setState({ depositLoading: true });
    if (this.props.is_v2 === true) {
      let amount = this.state.depositAmount;
      amount = new BigNumber(amount).times(1e18).toFixed(0);
      reward_token_dypius_bsc
        .approve(governancedypv2._address, amount)
        .then(() => {
          this.setState({ depositLoading: false, depositStatus: "deposit" });
        })
        .catch((e) => {
          this.setState({ depositLoading: false, depositStatus: "fail" });
          this.setState({ errorMsg: e?.message });
          setTimeout(() => {
            this.setState({
              depositStatus: "initial",
              depositAmount: "",
              errorMsg: "",
            });
          }, 8000);
        });
    } else if (this.props.is_v2 === false) {
      let amount = this.state.depositAmount;
      amount = new BigNumber(amount).times(1e18).toFixed(0);
      reward_token
        .approve(governance._address, amount)
        .then(() => {
          this.setState({ depositLoading: false, depositStatus: "deposit" });
        })
        .catch((e) => {
          this.setState({ depositLoading: false, depositStatus: "fail" });
          this.setState({ errorMsg: e?.message });
          setTimeout(() => {
            this.setState({
              depositStatus: "initial",
              depositAmount: "",
              errorMsg: "",
            });
          }, 8000);
        });
    }
  };

  handleAddVote = (e) => {
    this.setState({ depositLoading: true });
    if (this.props.is_v2 === true) {
      let amount = this.state.depositAmount;
      amount = new BigNumber(amount).times(1e18).toFixed(0);
      governancedypv2
        .addVotes(this.props.proposalId, this.state.option, amount)
        .then(() => {
          this.setState({ depositLoading: false, depositStatus: "success" });
          this.refreshBalance();
        })
        .catch((e) => {
          this.setState({ depositLoading: false, depositStatus: "fail" });
          this.setState({ errorMsg: e?.message });
          setTimeout(() => {
            this.setState({
              depositStatus: "initial",
              depositAmount: "",
              errorMsg: "",
            });
          }, 8000);
        });
    } else if (this.props.is_v2 === false) {
      let amount = this.state.depositAmount;
      amount = new BigNumber(amount).times(1e18).toFixed(0);
      governance
        .addVotes(this.props.proposalId, this.state.option, amount)
        .then(() => {
          this.setState({ depositLoading: false, depositStatus: "success" });
        })
        .catch((e) => {
          this.setState({ depositLoading: false, depositStatus: "fail" });
          this.setState({ errorMsg: e?.message });
          setTimeout(() => {
            this.setState({
              depositStatus: "initial",
              depositAmount: "",
              errorMsg: "",
            });
          }, 8000);
        });
    }
  };

  handleRemoveVote = (e) => {
    // e.preventDefault();
    this.setState({ removeLoading: true });
    if (this.props.is_v2 === true) {
      let amount = this.state.withdrawAmount;
      amount = new BigNumber(amount).times(1e18).toFixed(0);
      governancedypv2
        .removeVotes(this.props.proposalId, amount)
        .then(() => {
          this.setState({ removeLoading: false, removeStatus: "success" });
          this.refreshBalance();
        })
        .catch((e) => {
          this.setState({ removeLoading: false, removeStatus: "fail" });
          this.setState({ errorMsg2: e?.message });
          setTimeout(() => {
            this.setState({
              removeStatus: "initial",
              withdrawAmount: "",
              errorMsg2: "",
            });
          }, 8000);
        });
    } else if (this.props.is_v2 === false) {
      let amount = this.state.withdrawAmount;
      amount = new BigNumber(amount).times(1e18).toFixed(0);
      governance
        .removeVotes(this.props.proposalId, amount)
        .then(() => {
          this.setState({ removeLoading: false, removeStatus: "success" });
        })
        .catch((e) => {
          this.setState({ removeLoading: false, removeStatus: "fail" });
          this.setState({ errorMsg2: e?.message });
          setTimeout(() => {
            this.setState({
              removeStatus: "initial",
              withdrawAmount: "",
              errorMsg2: "",
            });
          }, 8000);
        });
    }
  };

  handleClaim = (e) => {
    e.preventDefault();
    if (this.props.is_v2 === true) {
      governancedypv2.withdrawAllTokens();
      this.refreshBalance();
    } else if (this.props.is_v2 === false) {
      governance.withdrawAllTokens();
      this.refreshBalance();
    }
  };

  handleSetMaxDeposit = (e) => {
    e.preventDefault();
    if (this.props.is_v2 === true) {
      this.setState({
        depositAmount: new BigNumber(this.state.token_balance)
          .div(1e18)
          .toFixed(18),
      });
    } else if (this.props.is_v2 === false) {
      this.setState({
        depositAmount: new BigNumber(this.state.token_balance_old)
          .div(1e18)
          .toFixed(18),
      });
    }
  };

  handleSetMaxWithdraw = (e) => {
    e.preventDefault();
    if (this.props.is_v2 === true) {
      this.setState({
        withdrawAmount: new BigNumber(this.state.depositedTokens)
          .div(1e18)
          .toFixed(18),
      });
    } else if (this.props.is_v2 === false) {
      this.setState({
        withdrawAmount: new BigNumber(this.state.depositedTokens_old)
          .div(1e18)
          .toFixed(18),
      });
    }
  };

  checkConnection = async () => {
    if (this.props.connected === true && this.props.networkId === 56) {
      this.setState({ is_wallet_connected: true });
      let coinbase = this.props.coinbase;
      this.setState({ coinbase: coinbase });
    }
    if (this.props.connected === false) {
      this.setState({ is_wallet_connected: false });
    }
  };

  refreshBalance = async () => {
    if (this.props.connected === true && this.props.networkId === 56) {
      this.refreshProposal();
      let coinbase = this.props.coinbase;
      if (coinbase && this.props.networkId === 56) {
        try {
          let _rBal = reward_token_dypius_bsc.balanceOf(coinbase);
          let _rBal_old = reward_token.balanceOf(coinbase);

          let _myVotes = governancedypv2.votesForProposalByAddress(
            coinbase,
            this.props.proposalId
          );

          let _myVotes_old = governance.votesForProposalByAddress(
            coinbase,
            this.props.proposalId
          );

          let _totalDeposited = governancedypv2.totalDepositedTokens(coinbase);
          let _totalDeposited_old = governance.totalDepositedTokens(coinbase);

          let _option = governancedypv2.votedForOption(
            coinbase,
            this.props.proposalId
          );
          let _lvsTime = governancedypv2.lastVotedProposalStartTime(coinbase);
          let _isExecutible = governancedypv2.isProposalExecutible(
            this.props.proposalId
          );
          let _q = governancedypv2.QUORUM();
          let _m = governancedypv2.MIN_BALANCE_TO_INIT_PROPOSAL();
          let _m_old = governance.MIN_BALANCE_TO_INIT_PROPOSAL();

          let [
            token_balance,
            token_balance_old,
            depositedTokens,
            depositedTokens_old,
            totalDeposited,
            totalDeposited_old,
            option,
            lastVotedProposalStartTime,
            is_proposal_executible,
            QUORUM,
            MIN_BALANCE_TO_INIT_PROPOSAL,
            MIN_BALANCE_TO_INIT_PROPOSAL_OLD,
          ] = await Promise.all([
            _rBal,
            _rBal_old,
            _myVotes,
            _myVotes_old,
            _totalDeposited,
            _totalDeposited_old,
            _option,
            _lvsTime,
            _isExecutible,
            _q,
            _m,
            _m_old,
          ]);

          this.setState({
            token_balance,
            token_balance_old,
            depositedTokens,
            depositedTokens_old,
            totalDeposited,
            totalDeposited_old,
            lastVotedProposalStartTime,
            QUORUM,
            MIN_BALANCE_TO_INIT_PROPOSAL,
            MIN_BALANCE_TO_INIT_PROPOSAL_OLD,
            is_proposal_executible:
              is_proposal_executible &&
              ["0", "1", "2", "4"].includes(
                this.state.proposal._proposalAction
              ),
          });

          if (this.state.option === "" || Number(depositedTokens) > 0)
            this.setState({ option });
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  getOptionText = (option) => {
    if (this.state.proposal._proposalAction === "0") {
      return { 0: "DISBURSE", 1: "BURN" }[option];
    }
    return { 0: "YES", 1: "NO" }[option];
  };

  handleSetOption = (option) => {
    if (Number(this.state.depositedTokens) > 0) return;
    this.setState({ option });
    localStorage.setItem(
      "NoVoteseth",
      getFormattedNumber(this.state.proposal._optionTwoVotes / 1e18, 6)
    );
  };

  handleExecute = () => {
    governancedypv2.executeProposal(this.props.proposalId);
  };

  render() {
    ////
    // let id = this.props.match.params.id;

    let {
      coinbase,
      token_balance,
      token_balance_old,
      proposal,
      totalDeposited,
      totalDeposited_old,
      depositedTokens,
      depositedTokens_old,
    } = this.state;

    if (!proposal._proposalId && this.props.is_v2 === false) return "";
    if (!proposal._proposalId && this.props.is_v2 === true) return "";

    token_balance = getFormattedNumber(token_balance / 1e18, 6);
    token_balance_old = getFormattedNumber(token_balance_old / 1e18, 6);

    totalDeposited = getFormattedNumber(totalDeposited / 1e18, 3);
    totalDeposited_old = getFormattedNumber(totalDeposited_old / 1e18, 3);

    depositedTokens = getFormattedNumber(depositedTokens / 1e18, 6);
    depositedTokens_old = getFormattedNumber(depositedTokens_old / 1e18, 6);

    let optionOneVotes = proposal._optionOneVotes;
    let optionTwoVotes = proposal._optionTwoVotes;
    let action = proposal._proposalAction;

    let actionText =
      {
        0: "Disburse / Burn",
        1: "Upgrade Governance",
        2: "Change Quorum",
        3: "Other / Free Text",
        4: "Change Min Balance",
      }[action] || "";

    optionOneVotes = getFormattedNumber(optionOneVotes / 1e18, 6);
    optionTwoVotes = getFormattedNumber(optionTwoVotes / 1e18, 6);

    let endsOn =
      proposal._proposalStartTime * 1e3 +
      window.config.vote_duration_in_seconds * 1e3;

    let expires = moment.duration(endsOn - Date.now()).humanize(true);

    let canRemoveVotes = false;

    if (Date.now() < endsOn) {
      canRemoveVotes = true;
    }

    let canWithdrawAll = false;
    let withdrawableTitleText = "";
    let canWithdrawAllAfter =
      this.state.lastVotedProposalStartTime * 1e3 +
      window.config.vote_duration_in_seconds * 1e3;
    if (Date.now() > canWithdrawAllAfter) {
      canWithdrawAll = true;
    } else if (canWithdrawAllAfter > Date.now()) {
      withdrawableTitleText =
        `You'll be able to withdraw ` +
        moment.duration(canWithdrawAllAfter - Date.now()).humanize(true);
    }

    return (
      <div className="token-staking">
        <div className="d-flex flex-column justify-content-between">
          <div className="proposalWrapper">
            <div className="row token-staking-form">
              <div className="col-12">
                <div className="activewrapper">
                  <div className="d-flex align-items-center justify-co ntent-between gap-5">
                    <h6
                      className={
                        expires.includes("ago")
                          ? "expiredtxt"
                          : "activetxt position-relative activetxt-vault"
                      }
                    >
                      <img
                        src={
                          expires.includes("ago")
                            ? "https://cdn.worldofdypians.com/tools/ellipseExpired.svg"
                            : "https://cdn.worldofdypians.com/tools/ellipse.svg"
                        }
                        alt=""
                        className="position-relative"
                      />
                      {expires.includes("ago") ? "Expired" : "Active"}
                    </h6>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-3">
                    <div
                      onClick={() => {
                        this.setState({ open: true });
                      }}
                    >
                      <h6 className="bottomitems">
                        <img
                          src={
                            "https://cdn.worldofdypians.com/tools/purpleStat.svg"
                          }
                          alt=""
                        />
                        Stats
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="d-flex  justify-content-between gap-4 mt-4">
                  <h6 className="start-title">Start Governance</h6>

                  {this.state.is_wallet_connected === false ? (
                    <button
                      className="connectbtn btn"
                      style={{ width: "fit-content" }}
                      onClick={() => {
                        this.setState({ showWalletModal: true });
                      }}
                    >
                      <img
                        src={'https://cdn.worldofdypians.com/tools/walletIcon.svg'}
                        alt=""
                      />
                      Connect wallet
                    </button>
                  ) : (
                    <div className="addressbtn btn">
                      <Address a={this.state.coinbase} chainId={56} />
                    </div>
                  )}
                </div>

                <div className="mt-4 otherside w-100">
                  <div className="form-group">
                    <div className="d-flex justify-content-between gap-2 align-items-center">
                      <div className="d-flex justify-content-between gap-4 align-items-center flex-column flex-lg-row">
                        <label
                          htmlFor="deposit-amount"
                          className="d-block text-left addvotestxt"
                        >
                          Add votes
                        </label>
                        <h6 className="mybalance-text">
                          Balance:
                          <b>
                            {this.props.is_v2 === true
                              ? token_balance
                              : token_balance_old}{" "}
                            DYP
                          </b>
                        </h6>
                      </div>
                      <Tooltip
                        placement="top"
                        title={
                          <div className="tooltip-text">
                            {
                              "Add votes to the governance pool.  The more you contribute, the more likely it will be for your vote to make an impact. Every vote counts!"
                            }
                          </div>
                        }
                      >
                        <img
                          src={
                            "https://cdn.worldofdypians.com/tools/more-info.svg"
                          }
                          alt=""
                        />
                      </Tooltip>
                    </div>
                    <div className="d-flex  flex-column flex-xxl-row flex-lg-row flex-md-row gap-2 align-items-center justify-content-between mt-2">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          value={
                            Number(this.state.depositAmount) > 0
                              ? this.state.depositAmount * LP_AMPLIFY_FACTOR
                              : this.state.depositAmount
                          }
                          onChange={(e) =>
                            this.setState({
                              depositAmount:
                                Number(e.target.value) > 0
                                  ? e.target.value / LP_AMPLIFY_FACTOR
                                  : e.target.value,
                            })
                          }
                          className="styledinput"
                          style={{ width: "120px" }}
                          placeholder="0"
                          type="text"
                        />

                        <button
                          className="btn maxbtn"
                          style={{ cursor: "pointer" }}
                          onClick={this.handleSetMaxDeposit}
                        >
                          MAX
                        </button>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          onClick={() => this.handleSetOption("0")}
                          className={
                            this.state.option === "0"
                              ? "emptybtnactive"
                              : "emptybtnpassive"
                          }
                          type="button"
                        >
                          <img
                            src={
                              this.state.option === "0"
                                ? "https://cdn.worldofdypians.com/tools/checkGov.svg"
                                : "https://cdn.worldofdypians.com/tools/emptyGov.svg"
                            }
                            alt=""
                          />

                          {this.getOptionText("0")}
                        </button>

                        <button
                          onClick={() => this.handleSetOption("1")}
                          className={
                            this.state.option === "1"
                              ? "emptybtnactive"
                              : "emptybtnpassive"
                          }
                          type="button"
                        >
                          <img
                            src={
                              this.state.option === "1"
                                ? "https://cdn.worldofdypians.com/tools/checkGov.svg"
                                : "https://cdn.worldofdypians.com/tools/emptyGov.svg"
                            }
                            alt=""
                          />
                          {this.getOptionText("1")}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row justify-content-center">
                    <button
                      style={{ width: "fit-content" }}
                      disabled={
                        this.state.depositAmount === "" ||
                        this.state.depositLoading === true ||
                        this.state.depositStatus === "success"
                          ? true
                          : false
                      }
                      className={`btn filledbtn ${
                        this.state.depositAmount === "" &&
                        this.state.depositStatus === "initial" &&
                        "disabled-btn"
                      } ${
                        this.state.depositStatus === "deposit" ||
                        this.state.depositStatus === "success"
                          ? "success-button"
                          : this.state.depositStatus === "fail"
                          ? "fail-button"
                          : null
                      } d-flex justify-content-center align-items-center gap-2`}
                      onClick={() => {
                        this.state.depositStatus === "deposit"
                          ? this.handleAddVote()
                          : this.state.depositStatus === "initial" &&
                            this.state.depositAmount !== ""
                          ? this.handleApprove()
                          : console.log("");
                      }}
                    >
                      {this.state.depositLoading ? (
                        <div
                          class="spinner-border spinner-border-sm text-light"
                          role="status"
                        >
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      ) : this.state.depositStatus === "initial" ? (
                        <>Approve</>
                      ) : this.state.depositStatus === "deposit" ? (
                        <>Add votes</>
                      ) : this.state.depositStatus === "success" ? (
                        <>Success</>
                      ) : (
                        <>
                          <img
                            src={
                              "https://cdn.worldofdypians.com/wod/failMark.svg"
                            }
                            alt=""
                          />
                          Failed
                        </>
                      )}
                    </button>
                  </div>
                  {this.state.errorMsg && (
                    <h6 className="errormsg">{this.state.errorMsg}</h6>
                  )}
                </div>
              </div>
              <div className="mt-4 col-12">
                <div className="otherside w-100">
                  <div className="form-group">
                    <div className="d-flex justify-content-between gap-2 align-items-center">
                      <div className="d-flex justify-content-between gap-4 align-items-center flex-column flex-lg-row">
                        <label
                          htmlFor="deposit-amount"
                          className="d-block text-left addvotestxt"
                        >
                          REMOVE VOTES
                        </label>
                      </div>
                      <Tooltip
                        placement="top"
                        title={
                          <div className="tooltip-text">
                            {
                              "Remove votes from the governance pool. You have the possibility to remove a part or all of them."
                            }
                          </div>
                        }
                      >
                        <img
                          src={
                            "https://cdn.worldofdypians.com/tools/more-info.svg"
                          }
                          alt=""
                        />
                      </Tooltip>
                    </div>

                    <div className="d-flex align-items-center gap-3 justify-content-between flex-column flex-column flex-lg-row mt-3">
                      <div className="d-flex align-items-center gap-2 ">
                        <input
                          value={
                            Number(this.state.withdrawAmount) > 0
                              ? this.state.withdrawAmount * LP_AMPLIFY_FACTOR
                              : this.state.withdrawAmount
                          }
                          onChange={(e) =>
                            this.setState({
                              withdrawAmount:
                                Number(e.target.value) > 0
                                  ? e.target.value / LP_AMPLIFY_FACTOR
                                  : e.target.value,
                            })
                          }
                          className="styledinput"
                          style={{ width: "120px" }}
                          placeholder="0"
                          type="text"
                        />
                        <button
                          className="btn maxbtn"
                          style={{ cursor: "pointer" }}
                          onClick={this.handleSetMaxWithdraw}
                        >
                          MAX
                        </button>
                      </div>
                      <button
                        style={{ width: "fit-content" }}
                        disabled={
                          this.state.withdrawAmount === "" ||
                          this.state.removeLoading === true ||
                          this.state.removeStatus === "success"
                            ? true
                            : false
                        }
                        className={`btn filledbtn ${
                          this.state.withdrawAmount === "" &&
                          this.state.removeStatus === "initial" &&
                          "disabled-btn"
                        } ${
                          this.state.removeStatus === "deposit" ||
                          this.state.removeStatus === "success"
                            ? "success-button"
                            : this.state.removeStatus === "fail"
                            ? "fail-button"
                            : null
                        } d-flex justify-content-center align-items-center gap-2`}
                        onClick={() => {
                          this.handleRemoveVote();
                        }}
                      >
                        {this.state.removeLoading ? (
                          <div
                            class="spinner-border spinner-border-sm text-light"
                            role="status"
                          >
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        ) : this.state.removeStatus === "initial" ? (
                          <>Remove</>
                        ) : this.state.removeStatus === "success" ? (
                          <>Success</>
                        ) : (
                          <>
                            <img
                              src={
                                "https://cdn.worldofdypians.com/wod/failMark.svg"
                              }
                              alt=""
                            />
                            Failed
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {this.state.errorMsg2 && (
                    <h6 className="errormsg">{this.state.errorMsg2}</h6>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pl-0">
            {proposal._proposalAction === "3" && (
              <div className="l-box proposal-details-wrapper">
                <div className="table-responsive">
                  <h6 className="proposal-details-title">PROPOSAL DETAILS</h6>
                  <p className="l-proposal-text">
                    <td colSpan> {proposal._proposalText} </td>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {this.state.open === true && (
          <Modal
            visible={this.state.open}
            modalId="statsmodal"
            title="stats"
            setIsVisible={() => {
              this.setState({ open: false });
            }}
            width="fit-content"
          >
            <div className="stats-container my-4">
              <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                <span className="stats-card-title">{`My ${this.getOptionText(
                  this.state.option
                )} Votes`}</span>
                <h6 className="stats-card-content">
                  {this.props.is_v2 === true
                    ? depositedTokens
                    : depositedTokens_old}{" "}
                  DYP
                </h6>
              </div>
              <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                <span className="stats-card-title">Proposal Action</span>
                <h6 className="stats-card-content">{actionText}</h6>
              </div>
              <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                <span className="stats-card-title">Expires</span>
                <h6 className="stats-card-content">{expires}</h6>
              </div>
              <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                <span className="stats-card-title">
                  My {this.props.is_v2 === true ? "DYPv2" : "DYP"} Balance
                </span>
                <h6 className="stats-card-content">
                  {this.props.is_v2 === true
                    ? token_balance
                    : token_balance_old}{" "}
                  {this.props.is_v2 === true ? "DYPv2" : "DYP"}
                </h6>
              </div>
              <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                <span className="stats-card-title">
                  {this.getOptionText("0")} Votes
                </span>
                <h6 className="stats-card-content">{optionOneVotes} DYP</h6>
              </div>
              <div className="stats-card p-4 d-flex flex-column mx-auto w-100">
                <span className="stats-card-title">
                  {this.getOptionText("1")} Votes
                </span>
                <h6 className="stats-card-content">{optionTwoVotes} DYP</h6>
              </div>
            </div>
            <div className="d-flex flex-column flex-lg-row flex-md-row align-items-start align-items-lg-center align-items-md-center justify-content-between gap-1 mb-3">
              <div className="d-flex flex-column gap-1">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://github.com/dypfinance/Avalanche-Bridge-and-Farming-contracts/tree/main/Audits`}
                  className="stats-link"
                >
                  Audit{" "}
                  <img
                    src={
                      "https://cdn.worldofdypians.com/tools/statsLinkIcon.svg"
                    }
                    alt=""
                  />
                </a>
              </div>
              <div className="d-flex align-items-center gap-1 justify-content-between">
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "12px",
                    lineHeight: "18px",
                    color: "#C0C9FF",
                  }}
                >
                  Contract Address
                </span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${window.config.bscscan_baseURL}address/${
                    this.props.is_v2 === true
                      ? governancedypv2._address
                      : governance._address
                  }`}
                  className="stats-link"
                >
                  {shortAddress(
                    this.props.is_v2 === true
                      ? governancedypv2._address
                      : governance._address
                  )}{" "}
                  <img
                    src={
                      "https://cdn.worldofdypians.com/tools/statsLinkIcon.svg"
                    }
                    alt=""
                  />
                </a>
              </div>
              <div className="d-flex align-items-center gap-1 justify-content-between">
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "12px",
                    lineHeight: "18px",
                    color: "#C0C9FF",
                  }}
                >
                  My Address
                </span>

                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${window.config.bscscan_baseURL}address/${this.state.coinbase}`}
                  className="stats-link"
                >
                  {shortAddress(this.state.coinbase)}{" "}
                  <img
                    src={
                      "https://cdn.worldofdypians.com/tools/statsLinkIcon.svg"
                    }
                    alt=""
                  />
                </a>
              </div>
            </div>
            <div className="separator"></div>
            <h6 className="footertext">
              Proposals may be executed within <b>3 days</b> after voting ends.
              Quorum requirement is a minimum of{" "}
              <b>
                {getFormattedNumber(
                  this.props.is_v2 === true
                    ? this.state.MIN_BALANCE_TO_INIT_PROPOSAL / 1e18
                    : this.state.MIN_BALANCE_TO_INIT_PROPOSAL_OLD / 1e18
                )}{" "}
                DYP
              </b>
              , proposals with winning votes less than QUORUM will not be
              executed. Disburse proposals will disburse a maximum amount of DYP
              with a <b>-2.5% Price Impact</b>.
            </h6>
          </Modal>
        )}

        {this.state.showWalletModal && (
          <WalletModal
            show={this.state.showWalletModal}
            handleClose={() => {
              this.setState({ showWalletModal: false });
            }}
            handleConnection={() => {
              // this.props.handleConnection();
              this.setState({ showWalletModal: false });
            }}
          />
        )}
      </div>
    );
  }
}
