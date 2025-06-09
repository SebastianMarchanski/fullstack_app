import React, { useEffect, useState } from "react";
import { groupsApi } from "../../api/groupsApi";
import { useAuth } from "../../context/useAuth";
import styles from "./Group.module.scss";
import AddGroupTransaction from "./AddGroupTransaction";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { toast } from "react-toastify";
import { useBalance } from "../../components/BalanceBar/useBalance";
import { useParams, useNavigate } from "react-router-dom"; // ✅ dodane

interface Group {
  id: number;
  name: string;
  ownerId: number;
}

interface Member {
  id: number;
  userId: number;
  groupId: number;
  userEmail: string;
}

interface Debt {
  id: number;
  debtor: { email: string };
  creditor: { email: string };
  amount: number;
  title: string;
  markedAsPaid: boolean;
  confirmedByCreditor: boolean;
}

const GroupMembersPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>(); // ✅ pobranie z URL
  const navigate = useNavigate(); // ✅ cofanie
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [debts, setDebts] = useState<Debt[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { refreshBalance } = useBalance();

  useEffect(() => {
    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      const groupData = await groupsApi.getGroup(Number(groupId));
      setGroup(groupData);
      fetchMembers(groupData.id);
    } catch (error) {
      toast.error("Nie udało się załadować grupy.");
    }
  };

  const fetchMembers = async (id: number) => {
    const data = await groupsApi.getGroupMembers(id);
    const debtsData = await groupsApi.getDebts(id);
    setDebts(debtsData);
    setMembers(data);
  };

  const handleAddMember = async () => {
    if (!group) return;
    try {
      await groupsApi.addMember(group.id, newMemberEmail);
      setNewMemberEmail("");
      fetchMembers(group.id);
    } catch (error: any) {
      toast.error(error.message || "Wystąpił błąd.");
    }
  };

  const handleRemove = async (id: number) => {
    if (!group) return;
    await groupsApi.removeMember(id);
    fetchMembers(group.id);
  };

  const handleDeleteDebt = async (debtId: number) => {
    try {
      await groupsApi.deleteDebt(debtId);
      toast.success("Dług usunięty!");
      if (group) fetchMembers(group.id);
    } catch (error) {
      toast.error("Błąd usuwania długu.");
    }
  };

  const handleMarkAsPaid = async (debtId: number) => {
    await groupsApi.markDebtAsPaid(debtId);
    if (group) fetchMembers(group.id);
  };

  const handleConfirmPayment = async (debtId: number) => {
    await groupsApi.confirmDebtPayment(debtId);
    refreshBalance(null);
    if (group) fetchMembers(group.id);
  };

  if (!group) return <div>Ładowanie grupy...</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Wróć do grup
      </button>
      <h2>Członkowie grupy: {group.name}</h2>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Email użytkownika"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
        />
        <button
          onClick={handleAddMember}
          disabled={newMemberEmail.trim().length < 3}
        >
          Dodaj członka
        </button>
      </div>

      <AddGroupTransaction
        groupId={group.id}
        onTransactionAdded={() => fetchMembers(group.id)}
      />

      <ul className={styles.memberList}>
        {members.map((member) => (
          <li key={member.id}>
            {member.userEmail}
            {member.userId === group.ownerId && (
              <span className={styles.adminLabel}>(admin)</span>
            )}
            {user?.id === group.ownerId && member.userId !== group.ownerId && (
              <button
                onClick={() => {
                  setSelectedMemberId(member.id);
                  setShowConfirmModal(true);
                }}
              >
                Usuń
              </button>
            )}
          </li>
        ))}
      </ul>

      {debts.length > 0 && (
        <div className={styles.debtsSection}>
