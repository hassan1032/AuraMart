import React, { useState } from "react";
import { Pencil, Link as LinkIcon } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Table, Th, Td } from "../../../ui/Table";
import { Modal } from "../../../ui/Modal";

const INITIAL = [
  { id: 1, name: "Facebook", icon: "ðŸŸ¦", link: "" },
  { id: 2, name: "LinkedIn", icon: "ðŸ”µ", link: "https://www.linkedin.com/company/yourcompany" },
  { id: 3, name: "Instagram", icon: "ðŸŸ£", link: "" },
  { id: 4, name: "YouTube", icon: "ðŸ”´", link: "" },
];

const SocialLink = () => {
  const [links, setLinks] = useState(INITIAL);
  const [editItem, setEditItem] = useState(null);

  const handleEdit = (item) => setEditItem({ ...item });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLinks(prev => prev.map(l => l.id === editItem.id ? editItem : l));
    setEditItem(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Social Links" subtitle="Configure social media profile links" breadcrumbs={[{ label: "Business" }, { label: "Social Links" }]} />

      <Card>
        <CardHeader><CardTitle>Social Platforms</CardTitle></CardHeader>
        <Table>
          <thead>
            <tr><Th className="w-10">#</Th><Th>Platform</Th><Th>Link</Th><Th className="text-center w-16">Edit</Th></tr>
          </thead>
          <tbody>
            {links.map((item, i) => (
              <tr key={item.id}>
                <Td className="text-gray-400 text-xs">{i + 1}</Td>
                <Td><div className="flex items-center gap-2 font-medium text-gray-800"><span>{item.icon}</span>{item.name}</div></Td>
                <Td>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[#E63946] hover:underline text-sm flex items-center gap-1">
                      <LinkIcon size={12} />{item.link}
                    </a>
                  ) : <span className="text-gray-400 text-sm italic">Not set</span>}
                </Td>
                <Td className="text-center">
                  <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} onClick={() => handleEdit(item)} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title={`Update ${editItem?.name || ""} Link`} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <input type="text" value={editItem?.name || ""} readOnly className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile URL</label>
            <input type="url" value={editItem?.link || ""} onChange={e => setEditItem(p => ({ ...p, link: e.target.value }))} placeholder="https://..."
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button type="submit">Update Link</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SocialLink;
