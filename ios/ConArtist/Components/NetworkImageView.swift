//
//  NetworkImageView.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-24.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift
import RxCocoa

// TODO: show a loading thing when these are loading
class NetworkImageView: UIImageView {
    private let disposeBag = DisposeBag()

    private let _imageId = BehaviorRelay<String?>(value: nil)
    @IBInspectable var imageId: String? {
        get { return _imageId.value }
        set { _imageId.accept(newValue) }
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        doInit()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        doInit()
    }

    private func doInit() {
        _imageId
            .flatMap { (id: String?) -> Single<UIImage?> in
                if let id = id {
                    return ConArtist.API.Images.load(imageId: id)
                } else {
                    return Single.just(nil)
                }
            }
            .asDriver(onErrorJustReturn: nil)
            .drive(rx.image)
            .disposed(by: disposeBag)
    }
}
