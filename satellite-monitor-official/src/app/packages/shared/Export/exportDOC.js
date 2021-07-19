import React from 'react';
import { Document, Paragraph, AlignmentType, TextRun, Packer, SymbolRun, HeadingLevel } from 'docx';
import * as FileSaver from 'file-saver';
import { Button } from 'adapters/ant-design';

const exportDOC = () => {

    const document = new Document();

    const gen = () => {
        document.addSection({
            children: [
                new Paragraph({
                    text: 'BÁO CÁO QUỸ ĐẠO VỆ TINH',
                    alignment: AlignmentType.CENTER,
                    heading: HeadingLevel.TITLE,
                    //numbering: 14
                }),
                new Paragraph({
                    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
                        + 'Assumenda debitis ea eveniet ad quidem enim, rem fuga hic soluta suscipit culpa doloremque recusandae est cum corrupti iste autem quibusdam consequuntur explicabo in cupiditate.'
                        + 'Ea placeat nulla eligendi, excepturi atque, quisquam, obcaecati fugiat quasi tenetur minima repudiandae iure provident minus laudantium.',
                    alignment: AlignmentType.JUSTIFIED,
                    children: [
                        new TextRun({
                            text: 'test text',
                            size: 28
                        })
                    ]
                })
            ]
        })

        Packer.toBlob(document).then(blob => {
            FileSaver.saveAs(blob, 'text1.docx');
            console.log('success');
        })

    }
    return (
        <div>
            <Button onClick={gen}>Download docx</Button>
        </div>
    )
}

export default exportDOC;