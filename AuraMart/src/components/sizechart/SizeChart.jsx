import { X, Ruler } from 'lucide-react';

const thCls = 'px-3 py-2 text-xs font-bold text-left whitespace-nowrap bg-[#FAF7F2] border border-[#EAEAEA]';
const tdCls = 'px-3 py-2 text-xs text-gray-700 border border-[#EAEAEA] whitespace-nowrap';
const tdHdCls = 'px-3 py-2 text-xs font-semibold text-gray-800 border border-[#EAEAEA] whitespace-nowrap bg-[#FAFAFA]';

const ageHeaders = ['9-12 Mo','12-18 Mo','18-24 Mo','2-3 Yrs','3-4 Yrs','4-5 Yrs','5-6 Yrs','6-7 Yrs','7-8 Yrs','9-10 Yrs','11-12 Yrs'];

const girlsCmRows = [
  ['Chest', '49cm','53cm','57cm','59cm','61cm','63.5cm','66cm','71cm','76cm','76cm','82cm'],
  ['Waist', '49cm','52cm','54cm','55cm','56cm','58cm','60cm','66cm','71cm','71cm','76cm'],
  ['Back nape to waist','14cm (empire)','19cm','21cm','21.5cm','22cm','24cm','26cm','29cm','32cm','34cm','34cm'],
  ['STYLE 1 – Back nape to hem','52cm','59cm','67cm','71cm','75cm','81.5cm','88cm','100cm','111cm','111cm','129cm'],
  ['STYLE 2 – Back nape to hem','-','-','62cm','64cm','67cm','71cm','76cm','89cm','100cm','100cm','112cm'],
  ['STYLE 3 – Back nape to hem','-','-','79cm','84.5cm','90cm','96cm','102cm','112cm','123cm','123cm','141cm'],
  ['STYLE 4 – Back nape to hem','-','-','-','61cm','65cm','71cm','81cm','90cm','100cm','100cm','—'],
  ['Upper arm','18cm','18.5cm','19cm','20cm','21cm','22cm','22cm','23cm','23.5cm','24cm','—'],
  ['Sash length','2m','2.25m','2.25m','2.25m','2.5m','2.5m','2.75m','3m','3m','3m','—'],
];

const boysCmRows = [
  ['Waist','-','47cm','50cm','52cm','54cm','56cm','58cm','63cm','-','-','-'],
  ['Chest – shirt','60cm','64cm','66cm','70cm','73cm','75cm','81cm','-','-','-','-'],
  ['Chest – waistcoat','56cm','58cm','64cm','66cm','69cm','71cm','75cm','-','-','-','-'],
  ['Shirt sleeve','28cm','32cm','34.5cm','37cm','39.5cm','42cm','46cm','-','-','-','-'],
  ['Outside leg (full)','47cm','49cm','51cm','54cm','58.5cm','63cm','72cm','-','-','-','-'],
  ['Inside leg (full)','32cm','34cm','36cm','38cm','42cm','46cm','54cm','-','-','-','-'],
  ['3/4 trousers – outside','-','38cm','40cm','42cm','44cm','47.5cm','51cm','-','-','-','-'],
  ['3/4 trousers – inside','-','22.5cm','24.5cm','26cm','28cm','31cm','34cm','-','-','-','-'],
  ['French shorts – outside','29cm','31cm','32.5cm','34cm','36.5cm','39cm','-','-','-','-','-'],
  ['French shorts – inside','17cm','15cm','16.5cm','18cm','20cm','22cm','26cm','-','-','-','-'],
  ['Cummerbund','-','-','-','Sm 53cm','Md 59cm','Lg 66cm','-','-','-','-','-'],
];

const SizeTable = ({ label, headers, rows }) => (
  <div className="mb-8">
    <h3 className="font-bold text-gray-800 text-sm mb-3 uppercase tracking-wider">{label}</h3>
    <div className="overflow-x-auto rounded-lg border border-[#EAEAEA]">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={thCls}></th>
            {headers.map(h => <th key={h} className={thCls}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
              <td className={tdHdCls}>{row[0]}</td>
              {row.slice(1).map((cell, j) => <td key={j} className={tdCls}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SizeChart = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 py-6 px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEAEA] sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Ruler size={18} className="text-[#E63946]" />
            <h2 className="font-bold text-gray-800">Size Chart</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Please take a look at our sizing videos for{' '}
            <a href="#" className="text-[#E63946] hover:underline font-semibold">Bespoke Outfits</a>{' '}
            &amp;{' '}
            <a href="#" className="text-[#E63946] hover:underline font-semibold">Ready To Wear</a>{' '}
            for help taking accurate measurements. All measurements in centimetres.
          </p>

          <SizeTable label="Girls (Centimetres)" headers={ageHeaders} rows={girlsCmRows} />

          <div className="bg-[#F8F9FA] rounded-xl p-4 mb-8 text-xs text-gray-600 space-y-1">
            <p><strong>STYLE LIST 1:</strong> Anna, Aurelia, Chloe, Claudia, Claudette, Eliza, Emmeline, Evie, Grace, Harriet, Flora, Jasmine, Jessica, Juliet, Juno, Lillian, Lily, Lulu, Maisie, Matilda, Millicent, Mirabelle, Rose, Sarah, Sorbet Sylvie, Sylvie, Tinkerbelle, Titania, Victoria</p>
            <p><strong>STYLE LIST 2:</strong> Antonia, Martha, Ruthie</p>
            <p><strong>STYLE LIST 3:</strong> Daisy, Odette, Olivia, Rachel</p>
            <p><strong>STYLE LIST 4:</strong> Amy, Dolly</p>
            <p className="text-[#6B7280] mt-2">Note: Apart from Ruthie (2.5cm longer in bodice and empire styles), all nape to waist measurements are taken from nape to 2.5cm above true waist.</p>
          </div>

          <SizeTable label="Boys (Centimetres)" headers={ageHeaders} rows={boysCmRows} />

          <div className="flex justify-end mt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#E63946] hover:bg-[#C5303A] text-white font-semibold rounded-lg text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChart;
