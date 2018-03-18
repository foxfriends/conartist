//
//  RecordDetailsItemsTableViewCell.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-03-15.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit

class RecordDetailsItemsTableViewCell: UITableViewCell {
    static let ID = "RecordDetailsItemsCell"

    @IBOutlet weak var typeLabel: UILabel!
    @IBOutlet weak var productsCollectionView: UICollectionView!

    fileprivate var items: [Product]!

    func setup(for productType: ProductType, with items: [Product]) {
        self.items = items
        typeLabel.text = productType.name
        productsCollectionView.dataSource = self
        productsCollectionView.delegate = self
        productsCollectionView.reloadData()
    }

    static func height(with count: Int) -> CGFloat {
        return ceil(20 + ceil(CGFloat(count) / 2.0) * 20)
    }
}

// MARK: - UICollectionViewDataSource
extension RecordDetailsItemsTableViewCell: UICollectionViewDataSource {
    func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }

    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return items.count
    }

    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: RecordDetailsItemCollectionViewCell.ID, for: indexPath) as! RecordDetailsItemCollectionViewCell
        cell.setup(name: items[indexPath.row].name)
        return cell
    }
}

// MARK: - UICollectionViewDelegateFlowLayout
extension RecordDetailsItemsTableViewCell: UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: productsCollectionView.frame.width / 2 - 5, height: 20)
    }
}

