import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Globe, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Table, Th, Td, TableEmpty } from "../../ui/Table";
import { ConfirmModal } from "../../ui/Modal";

const INITIAL_LANGS = [
  { id: 2, code: "en", name: "English",  default: true  },
  { id: 7, code: "ar", name: "Arabic",   default: false },
];

const Language = () => {
  const [langs, setLangs]       = useState(INITIAL_LANGS);
  const [confirmId, setConfirmId] = useState(null);

  const handleDelete = () => {
    setLangs(prev => prev.filter(l => l.id !== confirmId));
    toast.success("Language deleted");
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Languages"
        subtitle="Manage storefront display languages"
        breadcrumbs={[{ label: "Settings" }, { label: "Languages" }]}
        icon={<Globe size={20} />}
        action={
          <Link to="/admin/language/create">
            <Button icon={<Plus size={15} />}>Add Language</Button>
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Languages <span className="text-[#6B7280] font-normal text-sm">({langs.length})</span></CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Code</Th>
              <Th>Language Name</Th>
              <Th>Status</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {langs.length === 0 ? (
              <TableEmpty message="No languages added" icon={<Globe size={22} />} />
            ) : (
              langs.map((lang, i) => (
                <tr key={lang.id}>
                  <Td className="text-[#6B7280] text-xs">{i + 1}</Td>
                  <Td>
                    <span className="font-mono text-xs bg-[#FAF7F2] border border-[#EAEAEA] px-2 py-0.5 rounded font-semibold text-[#2B2D42] uppercase">
                      {lang.code}
                    </span>
                  </Td>
                  <Td className="font-medium text-[#2B2D42]">{lang.name}</Td>
                  <Td>
                    {lang.default
                      ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F8E9] text-[#7CB342]">Default</span>
                      : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-[#6B7280]">Secondary</span>
                    }
                  </Td>
                  <Td>
                    <div className="flex items-center justify-center gap-1">
                      <Link to={`/admin/language/edit/${lang.id}`}>
                        <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} />
                      </Link>
                      {!lang.default && (
                        <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(lang.id)} />
                      )}
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      <ConfirmModal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Language"
        message="This will permanently delete this language and all associated translations."
      />
    </div>
  );
};

export default Language;
